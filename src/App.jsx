import { useState } from "react";
import "./assets/style.css";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  
  // 表單資料狀態(儲存登入表單輸入)
  const[formData, setFormData]=useState({
    username:"",
    password:""
  });

  // 登入狀態管理(控制顯示登入或產品頁）
  const[isAuth, setIsAuth]=useState(false);

  // 產品資料狀態
  const [products, setProducts] = useState([]);

  // 目前選中的產品
  const [tempProduct, setTempProduct] = useState(null);

  // 抓取onChange數值
  const handleInputChange = (e) => {
    //抓取input中的name、value
    const{name,value}=e.target;
    setFormData((prevData) => ({
    ...prevData, // 保留原有屬性
    [name]: value, // 更新特定屬性name、value
  }));
  };

  // 取得產品資料API
  const getData = async () => {
    try{
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(response.data.products);
    }catch(error){
      console.log(error.response.data.message);
    }
  }

  // 登入API
  const onSubmit = async (e) => {
    try{
      e.preventDefault();
      const response = await axios.post(`${API_BASE}/admin/signin`,formData);
      const {token, expired} =response.data;
      document.cookie = `wilsonToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;
      getData();
      setIsAuth(true);
    }catch(error){
      setIsAuth(false);
      console.log(error.response.data.message)
    }
    
  }

  // 檢查登入狀態API
  const checkLogin = async () => {
    try{
      // 讀取 Cookie
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("wilsonToken="))
        ?.split("=")[1];

        // 修改實體建立時所指派的預設配置，為了「重新整理頁面後」重新取回 token
      axios.defaults.headers.common['Authorization'] = token;

      const response = await axios.post(`${API_BASE}/api/user/check`);
      console.log(response.data);
    }catch(error){
      console.log(error.response.data.message)
    }
  }

  return (
    <>
    {
      !isAuth?(
      <div className='container login'>
      <h1>請先登入</h1>
      <form className="form-floating" onSubmit={(e)=>onSubmit(e)}>
        <div className="form-floating mb-3">
          <input type="email" className="form-control" name="username" placeholder="name@example.com" value={formData.username} onChange={(e)=>handleInputChange(e)}/>
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" name="password" placeholder="Password" value={formData.password} onChange={(e)=>handleInputChange(e)}/>
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-2">登入</button>
      </form>
    </div>
    ):(
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-6">
            <button type="button" className="btn btn-danger mb-5" onClick={()=>checkLogin()}>
              確認是否登入
            </button>
            <h2>產品列表</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>產品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th>查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td>{item.is_enabled == 1 ? "啟用" : "未啟用"}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => setTempProduct(item)}
                      >
                        查看細節
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <h2>單一產品細節</h2>
            {tempProduct ? (
              <div className="card mb-3">
                <img
                  src={tempProduct.imageUrl}
                  className="card-img-top primary-image"
                  alt="主圖"
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {tempProduct.title}
                    <span className="badge bg-primary ms-2">{}</span>
                  </h5>
                  <p className="card-text">商品描述：{tempProduct.category}</p>
                  <p className="card-text">商品內容：{tempProduct.content}</p>
                  <div className="d-flex">
                    <p className="card-text text-secondary">
                      <del>{tempProduct.origin_price}</del>
                    </p>
                    元 / {tempProduct.price} 元
                  </div>
                  <h5 className="mt-3">更多圖片：</h5>
                  <div className="d-flex flex-wrap">
                    {tempProduct.imagesUrl.map((item, index) => {
                      return (
                        <img
                          key={index}
                          src={item}
                          style={{ width: "200px", marginRight: "10px" }}
                          alt="附圖"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-secondary">請選擇一個商品查看</p>
            )}
          </div>
        </div>
      </div>
    )
    }
    </>
  );
}

export default App;
