import React, { useState, useEffect, useMemo } from "react";
import { CarDto } from "../../model/car/CarDto";
import {
  getAllCars,
  addCar,
  editCar,
  deleteCar,
} from "../../services/car/CarService";
import { Link } from "react-router-dom";
// FORMIK per i forms
function CarsLists() {
  const [cars, setCars] = useState<CarDto[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCarId, setEditCarId] = useState<number | null>(null);
  const [newCarBrand, setNewCarBrand] = useState("");
  const [newCarModel, setNewCarModel] = useState("");
  const [newCarPlate, setNewCarPlate] = useState("");
  const [newCarPrice, setNewCarPrice] = useState(0);
  const [newCarImage, setNewCarImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [filterBy, setFilterBy] = useState<"brand" | "model" | "plate">(
    "brand"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsData: CarDto[] = await getAllCars();
        setCars(carsData);
      } catch (error) {
        console.error("Errore recupero auto:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterByChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterBy(event.target.value as "brand" | "model" | "plate");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const value = car[filterBy].toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    });
  }, [cars, filterBy, searchTerm]);

  const handleAddCar = async () => {
    try {
      const newCarId =
        cars.length > 0 ? Math.max(...cars.map((car) => car.id)) + 1 : 1;
      const newCar: CarDto = {
        id: newCarId,
        brand: newCarBrand,
        model: newCarModel,
        plate: newCarPlate,
        price: newCarPrice,
        image: newCarImage,
      };
      const addedCar: CarDto = await addCar(newCar);
      setCars([...cars, addedCar]);
      setShowAddModal(false);
      setNewCarBrand("");
      setNewCarModel("");
      setNewCarPlate("");
      setNewCarPrice(0);
      setNewCarImage("");
    } catch (error) {
      console.error("Errore aggiunta auto:", error);
    }
  };

  const handleEditCar = async (car: CarDto) => {
    try {
      await editCar(car);
      const updatedCars = cars.map((c) => (c.id === car.id ? car : c));
      setCars(updatedCars);
      setShowEditModal(false);
      setEditCarId(null);
    } catch (error) {
      console.error("Errore modifica auto:", error);
    }
  };

  const handleDeleteCar = async (carId: number) => {
    try {
      await deleteCar(carId);
      const updatedCars = cars.filter((c) => c.id !== carId);
      setCars(updatedCars);
    } catch (error) {
      console.error("Errore eliminazione auto:", error);
    }
  };

  // const filteredCars = cars.filter((car) =>
  //   car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Lista delle auto</h1>

      <div className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
          />
        </svg>

        <select
          value={filterBy}
          onChange={handleFilterByChange}
          className="select select-bordered"
        >
          <option value="brand">Marca</option>
          <option value="model">Modello</option>
          <option value="plate">Targa</option>
        </select>
        <input
          placeholder={`Cerca auto per ${filterBy}`}
          value={searchTerm}
          onChange={handleSearchChange}
          className="input input-bordered input-primary"
        />
      </div>
      <button
        onClick={() => setShowAddModal(true)}
        className="btn btn-primary mb-4 mt-4"
      >
        Aggiungi auto
      </button>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Marca</th>
              <th>Modello</th>
              <th>Targa</th>
              <th>Prezzo/giorno</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car, index) => (
              <tr key={car.id} className="hover:text-primary">
                <td>{index + 1}</td>
                <td>
                  <Link to={`/cars/${car.id}`}>{car.brand}</Link>
                </td>
                <td>{car.model}</td>
                <td>{car.plate}</td>
                <td>€{car.price}</td>
                <td>
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setEditCarId(car.id);
                    }}
                    className="btn btn-sm btn-primary mr-2"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Inserisci i dati</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-ghost"
              >
                X
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Marca"
                value={newCarBrand}
                onChange={(e) => setNewCarBrand(e.target.value)}
                className="input input-bordered"
              />
              <input
                type="text"
                placeholder="Modello"
                value={newCarModel}
                onChange={(e) => setNewCarModel(e.target.value)}
                className="input input-bordered"
              />
              <input
                type="text"
                placeholder="Targa"
                value={newCarPlate}
                onChange={(e) => setNewCarPlate(e.target.value)}
                className="input input-bordered"
              />
              <input
                type="number"
                placeholder="Prezzo al giorno"
                value={newCarPrice}
                onChange={(e) => setNewCarPrice(parseFloat(e.target.value))}
                className="input input-bordered"
              />
              <input
                type="text"
                placeholder="Url immagine"
                value={newCarImage}
                onChange={(e) => setNewCarImage(e.target.value)}
                className="input input-bordered"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handleAddCar} className="btn btn-primary">
                Aggiungi
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-ghost"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Modifica i dati</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-ghost"
              >
                X
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Marca"
                value={newCarBrand}
                onChange={(e) => setNewCarBrand(e.target.value)}
                className="input input-bordered"
              />
              <input
                type="text"
                placeholder="Modello"
                value={newCarModel}
                onChange={(e) => setNewCarModel(e.target.value)}
                className="input input-bordered"
              />
              <input
                type="text"
                placeholder="Targa"
                value={newCarPlate}
                onChange={(e) => setNewCarPlate(e.target.value)}
                className="input input-bordered"
              />
              <input
                type="number"
                placeholder="Prezzo al giorno"
                value={newCarPrice}
                onChange={(e) => setNewCarPrice(parseFloat(e.target.value))}
                className="input input-bordered"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() =>
                  handleEditCar({
                    id: editCarId as number,
                    brand: newCarBrand,
                    model: newCarModel,
                    plate: newCarPlate,
                    price: newCarPrice,
                    image: newCarImage,
                  })
                }
                className="btn btn-primary"
              >
                Salva
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-ghost"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarsLists;
