import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CarDto } from '../../model/car/CarDto';
import { getCarById } from '../../services/car/CarService';


const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarDto | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const carData = await getCarById(Number(id));
        setCar(carData);
      } catch (error) {
        console.error('Error fetching car:', error);
      }
    };
    fetchCar();
  }, [id]);

  return (
    <div className="flex justify-center">
  {car ? (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={car.image} alt="Car" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          Dettaglio Auto
          <div className="badge badge-secondary">#{car.id}</div>
        </h2>
        <div className="flex justify-between">
          <div>
            <div className="badge badge-primary">{car.brand} {car.model}</div>
            <div className="badge badge-info gap-2">{car.plate}</div>
          </div>
          <p>Prezzo: €{car.price} al giorno</p>
        </div>
        <div className="card-actions justify-end">
        <button className="btn btn-success">Noleggia</button>
        </div>
      </div>
      <Link to="/cars" className="btn btn-primary mt-4">
        Back
      </Link>
    </div>
  ) : (
    <p>Loading...</p>
  )}
</div>

  );
};

export default CarDetails;
