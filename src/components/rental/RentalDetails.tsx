import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { RentalDto } from "../../model/rental/RentalDto";
import { getRentalById } from "../../services/rental/RentalService";

interface RentalProps {
  id: number;
}

const RentalDetails: React.FunctionComponent<RentalProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [rental, setRental] = useState<RentalDto | null>(null);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const rentalData = await getRentalById(Number(id));
        setRental(rentalData);
      } catch (error) {
        console.error('Error fetching rental:', error);
      }
    };
    fetchRental();
  }, [id]);

  return (
    <div className="flex justify-center">
    {rental ? (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            Dettagli Noleggio
            <div className="badge badge-secondary">ID: {rental.id}</div>
          </h2>
          <p>Auto ID: {rental.carId}</p>
          <p>User ID: {rental.userId}</p>
          <p>Data inizio: {rental.startDate}</p>
          <p>Data fine: {rental.endDate}</p>
          <p>Prezzo totale: {rental.totalPrice}</p>
          <div className="card-actions justify-end">
            <div className="badge badge-outline">Noleggio</div>
            <div className="badge badge-outline">{rental.id}</div>
          </div>
        </div>
        <Link to="/rentals" className="btn btn-primary mt-4">Back</Link>
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);
};

export default RentalDetails