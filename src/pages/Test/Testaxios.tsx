import { getTest } from "services/test";

const Testaxios = () => {
  const handleButtonClick = async () => {
    const msTest = await getTest();
    console.log(msTest);
  };
  return (
    <div>
      <h1>Order Page</h1>
      <button onClick={handleButtonClick}>Click me</button>
    </div>
  );
};

export default Testaxios;
