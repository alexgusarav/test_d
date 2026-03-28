import React from "react";
import { Link } from "react-router-dom";

function Home()  {
return (
<React.Fragment>
    <div>
      <h1>Welcome to the Home Page!</h1>
      <div>
      Пожалуйста  <Link to='/register'>зарегистрируйтесь</Link> или  <Link to='/login'>авторизуйтесь.</Link>
      </div>
    </div>

</React.Fragment>
);

}

export default Home;