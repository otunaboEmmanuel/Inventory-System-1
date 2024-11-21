import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import RequestService from "../components/modals/RequestService";
import PurchaseProduct from "../components/modals/PurchaseProduct"; // Make sure to import this

const Request = ({ sidebarOpen, toggleSidebar }) => {
  const [item, setItem] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [serviceRequests, setServiceRequests] = useState([
    { id: 1, customerName: 'John Doe', phoneModel: 'iPhone 13', issue: 'Screen Replacement', date: '2023-10-01' },
    { id: 2, customerName: 'Jane Smith', phoneModel: 'Samsung Galaxy S21', issue: 'Battery Replacement', date: '2023-10-02' },
    { id: 3, customerName: 'Alice Johnson', phoneModel: 'Google Pixel 6', issue: 'Software Issue', date: '2023-10-03' },
  ]);
  const [newRequest, setNewRequest] = useState({
    customerName: '',
    customerEmail: '',
    customerTel: '',
    phoneModel: '',
    issue: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState(''); // 'purchase' or 'service'

  const handleChange = (event) => {
    setItem(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      customerName: username,
      customerEmail: email,
      customerTel: newRequest.customerTel,
      item: item,
      totalPrice: 200.00, // Replace with actual price
    };

    try {
      const response = await fetch('http://localhost:3000/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      setModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Request.jsx
  const handleSubmitService = async (e) => {
    e.preventDefault();
    if (
      newRequest.customerName &&
      newRequest.customerEmail &&
      newRequest.customerTel &&
      newRequest.phoneModel &&
      newRequest.issue
    ) {
      try {
        const response = await fetch('http://localhost:3000/api/v1/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRequest),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok'); // Fixed missing quote
        }

        const result = await response.json();
        setServiceRequests([...serviceRequests, result]); // Add the new service request to the local state
        setNewRequest({ customerName: '', customerEmail: '', customerTel: '', phoneModel: '', issue: '' }); // Reset form
        setModalOpen(false); // Close the modal after submission
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('All fields are required'); // Optional: Log if any field is missing
    }
  };
  const openModal = (type) => {
    setFormType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewRequest({ customerName: '', customerEmail: '', customerTel: '', phoneModel: '', issue: '' }); // Reset service request form
  };

  return (
    <>
      <div className="home-page flex flex-row w-full min-h-screen">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-xl font-semibold mb-4">Choose an Option</h2>
          <div className=" flex gap-4">
            <Button
              variant="contained"
              sx={{ '&:hover': { backgroundColor: 'green' } }}
              onClick={() => openModal('purchase')}
            >
              Purchase an Item
            </Button>
            <Button
              variant="contained"
              sx={{ '&:hover': { backgroundColor: 'green' } }}
              onClick={() => openModal('service')}
            >
              Submit a Service Request
            </Button>
          </div>
        </div>
        <Modal open={modalOpen} onClose={closeModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 5
          }}>
            {formType === 'purchase' ? (
              <PurchaseProduct
                username={username}
                email={email}
                item={item}
                setUsername={setUsername}
                setEmail={setEmail}
                setItem={setItem}
                handleSubmit={handleSubmit}
              />
            ) : (
              <RequestService
                newRequest={newRequest}
                handleInputChange={handleInputChange}
                handleSubmitService={handleSubmitService}
                closeModal={closeModal}
              />
            )}
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default Request;