import React, { useState, useEffect } from 'react';
import { UserDto } from '../../model/user/UserDto';
import { getAllUsers, addUser, editUser, deleteUser } from '../../services/user/UserService';
import { Link } from 'react-router-dom';

function UsersList() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserSurname, setNewUserSurname] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [filterBy, setFilterBy] = useState<'name' | 'surname' | 'email'>('name');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData: UserDto[] = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Errore recupero utenti:', error);
      }
    };
    fetchData();
  }, []);

  const handleFilterByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterBy(event.target.value as 'name' | 'surname' | 'email');
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const filteredUsers = users.filter((user) => {
    const value = user[filterBy].toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  const handleAddUser = async () => {
    try {
      const newUser: Omit<UserDto, 'id'> = {
        name: newUserName,
        surname: newUserSurname,
        email: newUserEmail,
      };
      const addedUser: UserDto = await addUser(newUser as UserDto);
      setUsers([...users, addedUser]);
      setShowAddModal(false);
      setNewUserName('');
      setNewUserSurname('');
      setNewUserEmail('');
    } catch (error) {
      console.error('Errore aggiunta utente:', error);
    }
  };

  const handleEditUser = async (user: UserDto) => {
    try {
      await editUser(user.id as number, user);
      const updatedUsers = users.map(u => (u.id === user.id ? user : u));
      setUsers(updatedUsers);
      setShowEditModal(false);
      setEditUserId(null);
    } catch (error) {
      console.error('Errore modifica utente:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Errore eliminazione utente:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Lista degli utenti</h1>
      <div className="flex items-center space-x-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
</svg>

  <select 
    value={filterBy} 
    onChange={handleFilterByChange} 
    className="select select-bordered">
    <option value="name">Nome</option>
    <option value="surname">Cognome</option>
    <option value="email">Email</option>
  </select>
  <input
    placeholder={`Cerca utente per ${filterBy}`}
    value={searchTerm}
    onChange={handleSearchChange}
    className="input input-bordered input-primary"
  />
</div>
      <button onClick={() => setShowAddModal(true)} className="btn btn-primary mb-4 mt-4">
        Aggiungi utente
      </button>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Email</th>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className="hover:text-primary">
                <th>{index + 1}</th>
                <td><Link to={`/users/${user.id}`}>{user.email}</Link></td>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>
                  <button onClick={() => { setShowEditModal(true); setEditUserId(user.id); }} className="btn btn-sm btn-primary mr-2">Modifica</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="btn btn-sm btn-danger">Elimina</button>
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
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost">X</button>
            </div>
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Nome" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="input input-bordered" />
              <input type="text" placeholder="Cognome" value={newUserSurname} onChange={(e) => setNewUserSurname(e.target.value)} className="input input-bordered" />
              <input type="text" placeholder="Email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="input input-bordered" />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handleAddUser} className="btn btn-primary">Aggiungi</button>
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost">Annulla</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Modifica i dati</h3>
              <button onClick={() => setShowEditModal(false)} className="btn btn-ghost">X</button>
            </div>
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Nome" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="input input-bordered" />
              <input type="text" placeholder="Cognome" value={newUserSurname} onChange={(e) => setNewUserSurname(e.target.value)} className="input input-bordered" />
              <input type="text" placeholder="Email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="input input-bordered" />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => handleEditUser({ id: editUserId as number, name: newUserName, surname: newUserSurname, email: newUserEmail })} className="btn btn-primary">Salva</button>
              <button onClick={() => setShowEditModal(false)} className="btn btn-ghost">Annulla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersList;
