import React, { useEffect, useState } from "react";
import { RentalDto } from "../../model/rental/RentalDto";
import {
  addRental,
  deleteRental,
  editRental,
  getAllRentals,
} from "../../services/rental/RentalService";
import { Link } from "react-router-dom";
import moment from "moment";

function RentalsList() {
  const [rentals, setRentals] = useState<RentalDto[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRentalId, setEditRentalId] = useState<number | null>(null);
  const [newRentalUserId, setNewRentalUserId] = useState<number>(0);
  const [newRentalCarId, setNewRentalCarId] = useState<number>(0);
  const [newRentalStartDate, setNewRentalStartDate] = useState<string>("");
  const [newRentalEndDate, setNewRentalEndDate] = useState<string>("");
  const [newRentalPrice, setNewRentalPrice] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [filterBy, setFilterBy] = useState<"userId" | "carId" | "startDate" | "endDate" | "totalPrice">("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentalsData: RentalDto[] = await getAllRentals();
        setRentals(rentalsData);
      } catch (error) {
        console.error("Errore recupero noleggi:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterBy(event.target.value as "userId" | "carId" | "startDate" | "endDate" | "totalPrice");
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredRentals = rentals.filter((rental) => {
    const value = rental[filterBy].toString().toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });


  const handleAddRental = async () => {
    try {
      const newRental: Omit<RentalDto, "id"> = {
        userId: newRentalUserId,
        carId: newRentalCarId,
        startDate: newRentalStartDate,
        endDate: newRentalEndDate,
        totalPrice: newRentalPrice,
      };
      const addedRental: RentalDto = await addRental(newRental as RentalDto);
      setRentals([...rentals, addedRental]);
      setShowAddModal(false);
      setNewRentalUserId(0);
      setNewRentalCarId(0);
      setNewRentalStartDate("");
      setNewRentalEndDate("");
      setNewRentalPrice(0);
    } catch (error) {
      console.error("Errore aggiunta noleggio:", error);
    }
  };

  const handleEditRental = async (rental: RentalDto) => {
    try {
      await editRental(rental);
      const updatedRentals = rentals.map((r) =>
        r.id === rental.id ? rental : r
      );
      setRentals(updatedRentals);
      setShowEditModal(false);
      setEditRentalId(null);
    } catch (error) {
      console.error("Errore modifica noleggio:", error);
    }
  };

  const handleDeleteRental = async (rentalId: number) => {
    try {
      await deleteRental(rentalId);
      const updatedRentals = rentals.filter((r) => r.id !== rentalId);
      setRentals(updatedRentals);
    } catch (error) {
      console.error("Errore eliminazione noleggio:", error);
    }
  };



  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD-MM-YYYY");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Lista dei noleggi</h1>
      
      <div className="flex items-center space-x-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
</svg>

  <select 
    value={filterBy} 
    onChange={handleFilterByChange} 
    className="select select-bordered">
    <option value="userId">User ID</option>
    <option value="carId">Car ID</option>
    <option value="startDate">Data inizio</option>
    <option value="endDate">Data fine</option>
    <option value="totalPrice">Prezzo totale</option>
  </select>
  <input
  placeholder={`Cerca noleggio per ${filterBy}`}
  value={searchTerm}
  onChange={handleSearchChange}
  className="input input-bordered input-primary"
/>
</div>
      <button
        onClick={() => setShowAddModal(true)}
        className="btn btn-primary mb-4 mt-4"
      >
        Aggiungi noleggio
      </button>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>CarID</th>
              <th>UserID</th>
              <th>Data inizio</th>
              <th>Data fine</th>
              <th>Prezzo totale</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filteredRentals.map((rental, index) => (
              <tr key={rental.id} className="hover:text-primary">
                <th>
                  <Link to={`/rentals/${rental.id}`}>{index + 1}</Link>
                </th>
                <td>{rental.carId}</td>
                <td>{rental.userId}</td>
                <td>{formatDate(rental.startDate)}</td>
                <td>{formatDate(rental.endDate)}</td>
                <td>{rental.totalPrice}</td>
                <td>
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setEditRentalId(rental.id);
                    }}
                    className="btn btn-sm btn-primary mr-2"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDeleteRental(rental.id)}
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
                type="number"
                placeholder="Auto ID"
                value={newRentalCarId}
                onChange={(e) => setNewRentalCarId(Number(e.target.value))}
                className="input input-bordered"
              />
              <input
                type="date"
                placeholder="Inizio noleggio"
                value={newRentalStartDate}
                onChange={(e) => setNewRentalStartDate(e.target.value)}
                className="input input-bordered"
              />
              <input
                type="date"
                placeholder="Fine noleggio"
                value={newRentalEndDate}
                onChange={(e) => setNewRentalEndDate(e.target.value)}
                className="input input-bordered"
              />
              <input
                type="number"
                placeholder="User ID"
                value={newRentalUserId}
                onChange={(e) => setNewRentalUserId(Number(e.target.value))}
                className="input input-bordered"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handleAddRental} className="btn btn-primary">
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
                type="number"
                placeholder="Auto ID"
                value={newRentalCarId}
                onChange={(e) => setNewRentalCarId(Number(e.target.value))}
                className="input input-bordered"
              />
              <input
                type="date"
                placeholder="Inizio noleggio"
                value={newRentalStartDate}
                onChange={(e) => setNewRentalStartDate(e.target.value)}
                className="input input-bordered"
              />
              <input
                type="date"
                placeholder="Fine noleggio"
                value={newRentalEndDate}
                onChange={(e) => setNewRentalEndDate(e.target.value)}
                className="input input-bordered"
              />
              <input
                type="number"
                placeholder="User ID"
                value={newRentalUserId}
                onChange={(e) => setNewRentalUserId(Number(e.target.value))}
                className="input input-bordered"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() =>
                  handleEditRental({
                    id: editRentalId as number,
                    userId: newRentalUserId,
                    carId: newRentalCarId,
                    startDate: newRentalStartDate,
                    endDate: newRentalEndDate,
                    totalPrice: newRentalPrice,
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

export default RentalsList;
