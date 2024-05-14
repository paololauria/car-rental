import React, { useState, useEffect, useMemo } from "react";
import { CarDto } from "../../model/car/CarDto";
import {
  useAddCar,
  useAllCars,
  useDeleteCar,
  useEditCar,
} from "../../services/car/CarService";
import { Link } from "react-router-dom";
import CarForm from "../shared/CarForm";
import { max } from "moment";

function CarsLists() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [idCar, setIdCar] = useState(0);
  // Oggetto al posto di singole proprietà
  const [formData, setFormData] = useState<CarDto>({
    id: 0,
    brand: "",
    model: "",
    plate: "",
    price: 0,
    image: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"brand" | "model" | "plate">(
    "brand"
  );

  const { data: carsData, refetch: refetchCars } = useAllCars();

  const addCarMutation = useAddCar();
  const editCarMutation = useEditCar();
  const deleteCarMutation = useDeleteCar();

  useEffect(() => {
    refetchCars();
  }, []);

  useEffect(() => {
    if (carsData) {
      const maxId = carsData.reduce((maxId, car) => Math.max(car.id, maxId), 0);
      setIdCar(maxId + 1);
    }
  }, [carsData]);

  const handleFilterByChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterBy(event.target.value as "brand" | "model" | "plate");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCars = useMemo(() => {
    if (!carsData) return [];
    return carsData.filter((car: CarDto) => {
      const value = car[filterBy].toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    });
  }, [carsData, filterBy, searchTerm]);

const handleAddCar = async (values: CarDto) => {
  try {
    const newCar = { ...values, id: idCar }; 
    await addCarMutation.mutateAsync(newCar);
    setShowAddModal(false);
    refetchCars();
  } catch (error) {
    console.error("Errore aggiunta auto:", error);
  }
};

const handleEditCar = async (values: CarDto) => {
  try {
    const { id, ...updatedFields } = values;
    await editCarMutation.mutateAsync({ id, ...updatedFields });
    setShowEditModal(false);
    refetchCars();
  } catch (error) {
    console.error("Errore modifica auto:", error);
  }
};

const handleDeleteCar = async (id: number) => {
  try {
    // Aggiungere una conferma di eliminazione
    const confirmDelete = window.confirm("Sei sicuro di voler eliminare questa auto?");
    if (!confirmDelete) return; 

    await deleteCarMutation.mutateAsync(id);
    console.log("Auto eliminata con successo");
  } catch (error) {
    console.error("Errore eliminazione auto:", error);
  }
};

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Lista delle auto</h1>

      {/* Filtri */}
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

      {/* Bottone per aggiungere auto */}
      <button
        onClick={() => setShowAddModal(true)}
        className="btn btn-primary mb-4 mt-4"
      >
        Aggiungi auto
      </button>

      {/* Tabella delle auto */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Auto ID</th>
              <th>Marca</th>
              <th>Modello</th>
              <th>Targa</th>
              <th>Prezzo/giorno</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car: CarDto, index: number) => (
              <tr key={car.id} className="hover:text-primary">
                <td>{index + 1}</td>
                <td>{car.id}</td>
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
                      setFormData(car);
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

      {/* Modale Aggiunta Auto */}
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
            <CarForm
              initialValues={formData}
              onSubmit={handleAddCar}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modale Modifica Auto */}
      {showEditModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Inserisci i dati</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-ghost"
              >
                X
              </button>
            </div>
            <CarForm
              initialValues={formData}
              onSubmit={handleEditCar}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CarsLists;
