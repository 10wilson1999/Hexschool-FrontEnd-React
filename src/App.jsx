import { useEffect, useState, useRef } from "react";
import "./assets/style.css";
import axios from "axios";
import * as bootstrap from "bootstrap";
import ProductModal from "./components/ProductModal.jsx"
import Pagination from "./components/Pagination.jsx"
import Login from "./views/Login.jsx"
import Products from "./views/Products.jsx"

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  size:"",
};

function App() {
  
  // 產品表單資料模板
  const [templateData, setTemplateData] = useState(INITIAL_TEMPLATE_DATA);

  // modal模板
  const [modalType, setModalType] = useState(""); // "create", "edit", "delete"

  // 登入狀態管理(控制顯示登入或產品頁）
  const[isAuth, setIsAuth]=useState(false);

  // 產品資料狀態
  const [products, setProducts] = useState([]);

  // 存放頁數資訊
  const [pagination, setPagination] = useState({});

  // useRef 建立對 DOM 元素的參照
  const productModalRef = useRef(null);

  // 在 useEffect 中初始化 modal
  useEffect(() => {
    productModalRef.current = new bootstrap.Modal("#productModal");
    
    // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  // 取得產品資料API
  const getData = async (page=1) => {
    try{
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    }catch(error){
      console.log(error.response.data.message);
    }
  }

  // 檢查登入狀態
  useEffect(()=>{
    // 讀取 Cookie，還原登入狀態
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("wilsonToken="))
      ?.split("=")[1];
    
    if(token){
      // 修改實體建立時所指派的預設配置，為了「重新整理頁面後」重新取回 token
      axios.defaults.headers.common['Authorization'] = token;
    }

    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false
    })

    // 檢查登入狀態API
    const checkLogin = async () => {
      try{
        const response = await axios.post(`${API_BASE}/api/user/check`);
        console.log(response.data);
        setIsAuth(true);
        getData();
      }catch(error){
        console.log(error.response.data.message)
      }
    };

    checkLogin();
  },[])

  const openModal = (type, product)=>{
    setModalType(type);
    setTemplateData({
      ...INITIAL_TEMPLATE_DATA,
      ...product,
    })
    productModalRef.current.show()
  };

  const closeModal = ()=>{
    productModalRef.current.hide()
  };

  return (
    <>
    {
      !isAuth?(
      <Login
      getData={getData}
      setIsAuth={setIsAuth}
      />
    ):(
      <div className="container">
        <Products
        openModal={openModal}
        INITIAL_TEMPLATE_DATA={INITIAL_TEMPLATE_DATA}
        products={products}
        />
        <Pagination
        pagination={pagination}
        onChangePage={getData}
        />
      </div>
    )
    }
    <ProductModal 
    modalType={modalType}
    templateData={templateData}
    getData={getData}
    closeModal={closeModal}
    />
    </>
  );
}

export default App;
