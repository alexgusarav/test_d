import re,os,logging
from rest_framework.permissions import  IsAuthenticated, AllowAny
from .permissions import IsAdminUser, IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from django.http import JsonResponse, FileResponse
from .serializers import RegisterSerializer, UserSerializer, StorageSerializer, UserFilesSerializator
from django.utils import timezone
from django.shortcuts import get_object_or_404

from django.contrib.auth.models import User
from .models import Storage
from django.db.models import Sum, Count
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie

from rest_framework import viewsets
import json
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django.middleware.csrf import get_token
from django.contrib.sessions.models import Session
from django.core.files.storage import FileSystemStorage

logger = logging.getLogger(__name__)
# csrf token для запросов POST/PUT/DELETE
@ensure_csrf_cookie
def get_csrf_token(request):
    csrf_token_value = get_token(request)
    logger.info(f"CSRF token from {request.META.get('REMOTE_ADDR')}")
    return JsonResponse({'detail': "CSRF cookie set", 'csrftoken': csrf_token_value})

#получаем user id из сессии.
def get_user_id_from_session_key(session_key):
    try:
        session = Session.objects.get(session_key=session_key)
        session_data = session.get_decoded()
        uid = session_data.get('_auth_user_id')
        if uid:
            return uid
    except Session.DoesNotExist:
        pass
    return None

#получаем ip address запроса.
def get_client_ip(request):
    x_forwarded_header = request.META.get('HTTP_X_FORWARDED_FOR')
    if  x_forwarded_header:
        ip = x_forwarded_header.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

# регистрация нового пользователя.
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        print(request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user_instance = serializer.save()
            # auto-autenticate and login the user in (Session ID cookie sets automatically)
            login(request, user_instance)
            response_data = {
                "success": f"Username {request.data['username']} was created and logged in!",
                "data": RegisterSerializer(user_instance).data
            }
            logger.info(f'[INFO] Getted a request for registering user from IP {get_client_ip(request)}')
            logger.info(f"[INFO] Username {request.data['username']} was created and logged in!")

            # return JsonResponse({"success": f"Username {request.data['username']} was created and logged in!", "data": {user_instance}}, status=201)
            return Response(data=response_data, status=201)
        #username = request.data.get('name')
        #print(f'{username}')

        else:
            logger.info(f'[INFO] Getted a request for registering user from IP {get_client_ip(request)}')
            logger.warning(f'[ERR] ERROR Username {request.data['username']} was not created!')
            return JsonResponse({"error": "User is not created"})

# аутентификация пользователей.
@csrf_exempt
def LoginView(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            response_data = {
                "success": f"Username {username} was created and logged in!",
                "data": UserSerializer(user).data
            }
            logger.info(f'[INFO] User {username} was authentificated successfully.')
            response = JsonResponse({"msg":"Authorization was successful"})
            response.set_cookie("sessionid", request.session.session_key)
            logger.info(f'[INFO] Getted an authentification request from IP {get_client_ip(request)}')
            logger.info(f"[INFO] Username {username} was logged in!")
            return JsonResponse(response_data, status=200)

        else:
            logger.critical(f'[ERR] User {username} attempted register is failed. Incorrect credentials.')
            return JsonResponse({"error": "Incorrect credentials"}, status=401)
    else:
        logger.warning(f'[ERR] User {username} attempted register is metod not allowed.')
        return JsonResponse({"error": "Method is not allowed."}, status=403)

# выход пользователей.
def LogoutView(request):
    if request.user.is_authenticated:
        logout(request)
        response = JsonResponse({'success':"Logout was successful"})
        request.session.flush()
        response.delete_cookie("sessionid")
        return response
    else:
        return JsonResponse({'error':"User is not auth"})

"""
Admin Zone Security
"""

#запросы администратора управления пользователями /users
User = get_user_model()

class AdminUsersZone(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer(queryset, many=True)
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        return UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()
        queryset = queryset.annotate(
            size=Sum('files__size'),
            count=Count('files__id', distinct=True)
        )
        return queryset

    def destroy(self, request, pk=None):
        if pk == "1" and request.user.pk == 1:
            return Response({"detail": "Вы не можете удалить суперюзера!"}, status=403)
        user = get_object_or_404(User, pk=pk)
        logger.critical(f"[CRITICAL] Admin {self.request.user} is deleting user: {user.username}")
        user.delete()
        return Response(status=204)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        logger.info(f"[INFO] Пользователь {request.user} получил доступ к списку пользователей.")
        logger.debug(f"[DEBUG] Data отправлена во frontend: {response.data}")
        return response

#запросы администратора управления файлами /files
class AdminFilesZone(viewsets.ModelViewSet):
    queryset = Storage.objects.all()
    serializer = StorageSerializer(queryset, many=True)
    permission_classes= [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        return StorageSerializer

    def retrieve(self, request, *args, **kwargs):
        user_id = kwargs.get('pk')
        print(f"[info] User with id={user_id} retrive files.")
        queryset = Storage.objects.filter(owner_id=user_id).order_by('-uploaded_at')
        serializer = self.get_serializer(queryset, many=True)
        print(queryset)
        return Response(serializer.data)

    def list(self, request):
        session_key = request.session.session_key
        user_id = get_user_id_from_session_key(session_key)
        if user_id:
            queryset = Storage.objects.all().order_by('-uploaded_at')
            serializer = StorageSerializer(queryset, many=True)
            print(f"[info] User with id={user_id} is requested all files.")
        else:
            Response({'error':'Сессия пользователя не найдена.'})
        return Response(serializer.data)



"""
Authentificated Users Zone 
"""

class UserFilesView(viewsets.ModelViewSet):
    serializer_class = UserFilesSerializator
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    queryset = Storage.objects.all()
    #каждый пользователь видит только свои файлы.
    def get_queryset(self):
        return Storage.objects.filter(owner=self.request.user).order_by('-uploaded_at')

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response['Access-Control-Allow-Origin'] = '*'
        return response

    def create(self, request, *args, **kwargs):
        print(f"DEBUGGING request.data: {request.data}")
        print(f"DEBUGGING request.FILES: {request.FILES}")
        # вызываем стандартную логику perform_create через serializer.save()
        return super().create(request, *args, **kwargs)

        # загрузка файлов.

    def perform_create(self, serializer):
        uploaded_file = self.request.data.get('file')
        if not uploaded_file:
            logger.warning("[WRN] No files are attached in the request")
            raise serializers.ValidationError("[WRN] No file part in the request")
        owner = self.request.user
        owner_id = self.request.user.id
        file_size_bytes = uploaded_file.size
        file_size_mb = file_size_bytes / (1024 * 1024)
        upload_path = os.path.join('user_files', str(owner_id))
        fs = FileSystemStorage()
        user_filename = self.request.data.get('original_name')

        name, extension = os.path.splitext(uploaded_file.name)
        if not user_filename.endswith(extension):
            user_filename = f'{user_filename}{extension}'

        full_upload_path = os.path.join(upload_path, user_filename)
        final_path_name = fs.get_available_name(full_upload_path)
        final_filename = os.path.basename(final_path_name)

        if Storage.objects.filter(owner=owner, original_name=user_filename).exists():
            original_name_to_save = final_filename
        else:
            original_name_to_save = final_filename

        actual_saved_path = fs.save(final_path_name, uploaded_file)
        try:
            serializer.save(owner=owner, original_name=original_name_to_save, file=actual_saved_path, size=file_size_mb)
            logger.info(f"[INFO] User {owner.username} uploaded file {actual_saved_path}")
        except Exception as e:
            logger.error(f"[ERR] Error saving to DB: {e}")
            raise serializers.ValidationError({"detail": "Ошибка сохранения в базу данных"})

    def perform_destroy(self, instance):
        logger.critical(f"[ERR] {self.request.user.username} Удаление файла: {instance.file.name}")
        instance.file.delete(save=False)
        super().perform_destroy(instance)
        # логика после удаления.
        logger.critical(f"[ERR] Объект {instance.id} успешно удален из БД.")

    # переопределям метод обновления файлов.
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        logger.info("[INFO] Edit file request data :", request.data)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)



    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        logger.critical(f"[ERR] {self.request.user.username} is deleted file {instance.file.name}")
        self.perform_destroy(instance)
        return JsonResponse({'success': 'file was removed.'}, status=204)


# скачивание файлов.
def download_file_view(request, file_id):
    uuid_pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', re.IGNORECASE)
    isfile_uuid = uuid_pattern.match(file_id)
    # если file_id это uuid загружаем по специальной ссылке.
    if (bool(isfile_uuid) and not request.user.is_authenticated):
        # логика запроса по специальной ссылке.
        logger.info(f'[INFO] Получен запрос на скачивание файла {file_id} по специальной ссылке.')
        file_record = Storage.objects.get(secret_name=file_id)
        if file_record:
            file_record.downloaded_at = timezone.now()
            file_record.save()
            file_path = file_record.file.path
            if not os.path.exists(file_path):
                logger.error(f"[ERR] Ошибка! Файл не найден {file_path}")
                return JsonResponse({"detail": "Файл поврежден или отсутствует на сервере"},
                                    json_dumps_params={'ensure_ascii': False}, status=500)
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_record.original_name)
        return JsonResponse({"success": "запрос по специальной ссылке."}, json_dumps_params={'ensure_ascii': False},
                            status=200)

    if request.user.is_authenticated or request.user.is_superuser:
        # логика запроса по id файла.
        logger.info(f'[INFO] Получен запрос на скачивание файла {file_id} по id')
        try:
            if (request.user.is_superuser):
                file_record = Storage.objects.get(id=file_id)
            else:
                file_record = Storage.objects.get(id=file_id, owner=request.user)
            file_record.downloaded_at = timezone.now()
            file_record.save()
        except Storage.DoesNotExist:
            return JsonResponse({"detail": "Файл не найден или нет доступа."},
                                json_dumps_params={'ensure_ascii': False}, status=404)
        file_path = file_record.file.path
        if not os.path.exists(file_path):
            logger.error(f"Ошибка! Файл не найден {file_path}")
            return JsonResponse({"detail": "Файл поврежден или отсутствует на сервере"},
                                json_dumps_params={'ensure_ascii': False}, status=500)
        logger.info(f"Пользователь {request.user.username} скачал файл ID: {file_id}")
        response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_record.original_name)
        return response
    return JsonResponse({"detail": "Файл не найден или нет доступа."}, json_dumps_params={'ensure_ascii': False},
                        status=404)
