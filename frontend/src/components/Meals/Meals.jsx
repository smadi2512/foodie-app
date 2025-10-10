import MealItem from "./MealItem";
import Error from "../UI/Error";
import useHttp from "../../hooks/useHttp";


const requestConfig = {}; //Should be here so will be created once.

export default function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp("http://localhost:3000/meals", requestConfig, []);

  if (isLoading) {
    return <p className="center">Loading meals....</p>;
  }
  if (error) {
    return <Error title="Failed to fetch the meals." message={error} />;
  }

  return (
    <>
      <ul id="meals">
        {loadedMeals.map((meal) => (
          <MealItem key={meal.id} meal={meal} />
        ))}
      </ul>
    </>
  );
}
