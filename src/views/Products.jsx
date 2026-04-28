function Products({openModal, INITIAL_TEMPLATE_DATA,products}){
    return(
        <>
            <h2>產品列表</h2>
            <div className="text-end mt-4">
            <button
                type="button"
                className="btn btn-primary"
                onClick={()=>openModal("create", INITIAL_TEMPLATE_DATA)}>
                建立新的產品
            </button>
            </div>
            <table className="table">
            <thead>
                <tr>
                <th>分類</th>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>編輯</th>
                </tr>
            </thead>
            <tbody>
                {products.map((item) => (
                <tr key={item.id}>
                    <td>{item.category}</td>
                    <td>{item.title}</td>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td className={`${item.is_enabled ? 'text-success' : ''}`}>{item.is_enabled == 1 ? "啟用" : "未啟用"}</td>
                    <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>openModal("edit",item)}>編輯</button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>openModal("delete",item)}>刪除</button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </>
    )
};

export default Products;