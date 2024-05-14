import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserDto } from '../../model/user/UserDto';
import { getUserById } from '../../services/user/UserService';

interface UserProps {
  id: number;
}

const UserDetails: React.FunctionComponent<UserProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(Number(id));
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [id]);

  return (
    <div className="flex justify-center">
    {user ? (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            Dettagli Utente
            <div className="badge badge-secondary">ID: {user.id}</div>
          </h2>
          <p>Utente ID: {user.id}</p>
          <p>Nome e cognome: {user.name} {user.surname}</p>
          <p>Email: {user.email}</p>

          <div className="card-actions justify-end">
            <div className="badge badge-outline">Utente</div>
            <div className="badge badge-outline">{user.id}</div>
          </div>
        </div>
        <Link to="/users" className="btn btn-primary mt-4">Back</Link>
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);
};

export default UserDetails