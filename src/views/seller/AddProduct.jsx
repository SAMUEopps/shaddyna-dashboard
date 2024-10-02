import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsImages } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { get_category } from "../../store/Reducers/categoryReducer";
import { add_product, messageClear } from "../../store/Reducers/productReducer";
import MultiSelect from "../components/MultiSelect";
import { colourOptions, tagOptions } from "../components/data";
import MultiTagSelect from "../components/MultiTagSelect";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { successMessage, errorMessage, loader } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(
      get_category({
        searchValue: "",
        parPage: "",
        page: "",
      })
    );
  }, []);
  const [state, setState] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    brand: "",
    stock: "",
  });
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectColor, setselectColor] = useState([]);
  const [selectTag, setselectTag] = useState([]);

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allCategory.filter((c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      setAllCategory(srcValue);
    } else {
      setAllCategory(categorys);
    }
  };
  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);
  const imageHandle = (e) => {
    const files = e.target.files;
    const length = files.length;

    if (length > 0) {
      setImages([...images, ...files]);
      let imageUrl = [];

      for (let i = 0; i < length; i++) {
        imageUrl.push({ url: URL.createObjectURL(files[i]) });
      }
      setImageShow([...imageShow, ...imageUrl]);
    }
  };

  const changeImage = (img, index) => {
    if (img) {
      let tempUrl = imageShow;
      let tempImages = images;

      tempImages[index] = img;
      tempUrl[index] = { url: URL.createObjectURL(img) };
      setImageShow([...tempUrl]);
      setImages([...tempImages]);
    }
  };

  const removeImage = (i) => {
    const filterImage = images.filter((img, index) => index !== i);
    const filterImageUrl = imageShow.filter((img, index) => index !== i);
    setImages(filterImage);
    setImageShow(filterImageUrl);
  };

  useEffect(() => {
    setAllCategory(categorys);
  }, [categorys]);
  // console.log(userInfo.shopInfo.shopName);
  const add = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("price", state.price);
    formData.append("stock", state.stock);
    formData.append("selectColor", JSON.stringify(selectColor));
    formData.append("selectTag", JSON.stringify(selectTag));
    formData.append("category", category);
    formData.append("discount", state.discount);
    formData.append("shopName", userInfo.shopInfo.shopName);
    formData.append("brand", state.brand);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    dispatch(add_product(formData));
  };
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: "",
        description: "",
        discount: "",
        price: "",
        brand: "",
        stock: "",
      });
      setImageShow([]);
      setImages([]);
      setCategory("");
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="px-2 lg:px-7 pt-5 ">
      <div className="w-full p-4  bg-slate-100 rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-slate-600 text-xl font-semibold">Add Product</h1>
          <Link
            className="bg-green-500 hover:shadow-green-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2 "
            to="/seller/dashboard/products"
          >
            Products
          </Link>
        </div>
        <div>
          <form onSubmit={add}>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-slate-600">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="name">Product name</label>
                <input
                  className="px-4 py-2 focus:border-green-500 outline-none  border bg-slate-200 rounded-md text-slate-600"
                  onChange={inputHandle}
                  value={state.name}
                  required
                  type="text"
                  placeholder="product name"
                  name="name"
                  id="name"
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="brand">Product brand</label>
                <input
                  className="px-4 py-2 focus:border-green-500 outline-none  border bg-slate-200 rounded-md text-slate-600"
                  onChange={inputHandle}
                  value={state.brand}
                  type="text"
                  required
                  placeholder="Product brand"
                  name="brand"
                  id="brand"
                />
              </div>
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-slate-600">
              <div className="flex flex-col w-full gap-1 relative">
                <label htmlFor="category">Category</label>
                <input
                  readOnly
                  onClick={() => setCateShow(!cateShow)}
                  className="px-4 py-2 focus:border-green-500 outline-none  border bg-slate-200 rounded-md text-slate-600"
                  onChange={inputHandle}
                  value={category}
                  required
                  type="text"
                  placeholder="--select category--"
                  id="category"
                />
                <div
                  className={`absolute z-50 top-[101%] bg-slate-200 shadow w-full transition-all ${
                    cateShow ? "scale-100" : "scale-0"
                  }`}
                >
                  <div className="w-full px-4 py-2 fixed ">
                    <input
                      value={searchValue}
                      onChange={categorySearch}
                      className="px-3 py-1 w-full focus:border-green-500 outline-none bg-transparent border bg-slate-100 shadow rounded-md text-slate-800 font-medium overflow-hidden"
                      type="text"
                      placeholder="Search Here.."
                    />
                  </div>
                  <div className="pt-14"></div>
                  <div className="flex justify-start z-50 items-start flex-col h-[200px] overflow-y-scroll">
                    {allCategory.map((c, i) => (
                      <span
                        className={`px-4 py-2 hover:bg-green-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                          category === c.name && "bg-green-500"
                        }`}
                        onClick={() => {
                          setCateShow(false);
                          setCategory(c.name);
                          setSearchValue("");
                          setAllCategory(categorys);
                        }}
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="stock">Stock</label>
                <input
                  className="px-4 py-2 focus:border-green-500 outline-none  border bg-slate-200 rounded-md text-slate-600"
                  onChange={inputHandle}
                  value={state.stock}
                  type="number"
                  min="0"
                  required
                  placeholder="product stock"
                  name="stock"
                  id="stock"
                />
              </div>
            </div>

            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-slate-600">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="price">Price</label>
                <input
                  className="px-4 py-2 focus:border-green-500 outline-none  border bg-slate-200 rounded-md text-slate-600"
                  onChange={inputHandle}
                  value={state.price}
                  type="number"
                  placeholder="price"
                  required
                  name="price"
                  id="price"
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="discount">Discount</label>
                <input
                  min="0"
                  className="px-4 py-2 focus:border-green-500 outline-none  border bg-slate-200 rounded-md text-slate-600"
                  onChange={inputHandle}
                  value={state.discount}
                  type="number"
                  placeholder="%discount%"
                  required
                  name="discount"
                  id="discount"
                />
              </div>
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-slate-600">
              <div className="flex flex-col w-full gap-1 relative">
                {/* Add here */}
                <label htmlFor="color">Color</label>
                <MultiSelect
                  selectOptions={colourOptions}
                  setselectColor={setselectColor}
                  successMessage={successMessage}
                  // colorArray={product.colorArray}
                />
              </div>
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-slate-600">
              <div className="flex flex-col w-full gap-1 relative">
                {/* Add here */}
                <label htmlFor="tag">Tag</label>
                <MultiTagSelect
                  tagOptions={tagOptions}
                  setselectTag={setselectTag}
                  successMessage={successMessage}
                  // tagsArray={product.tagArray}
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-1 text-slate-600 mb-5">
              <label htmlFor="description">Description</label>
              <textarea
                rows={4}
                className="px-4 py-2 focus:border-green-500 outline-none bg-slate-100 border bg-slate-200 rounded-md text-slate-600"
                onChange={inputHandle}
                value={state.description}
                placeholder="description"
                required
                name="description"
                id="description"
              ></textarea>
            </div>
            <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-slate-600 mb-4">
              {imageShow.map((img, i) => (
                <div className="h-[180px] relative">
                  <label htmlFor={i}>
                    <img className="w-full h-full  rounded-sm" src={img.url} alt="" />
                  </label>
                  <input
                    onChange={(e) => changeImage(e.target.files[0], i)}
                    type="file"
                    id={i}
                    className="hidden"
                  />
                  <span
                    onClick={() => removeImage(i)}
                    className="p-2 z-0 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full"
                  >
                    <IoCloseSharp />
                  </span>
                </div>
              ))}
              <label
                className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-gray-500 border-dashed hover:border-green-500 w-full text-slate-600"
                htmlFor="image"
              >
                <span>
                  <BsImages />
                </span>
                <span>select image</span>
              </label>
              <input multiple onChange={imageHandle} className="hidden" type="file" id="image" />
            </div>
            <div className="flex">
              <button
                disabled={loader ? true : false}
                className="bg-green-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
              >
                {loader ? <PropagateLoader color="#fff" cssOverride={overrideStyle} /> : "Add product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
