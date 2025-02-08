'use client'
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { get_business, create_business } from './server_actions';

const EditBusinessPage: React.FC = () => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    
    const [newBusiness, setNewBusiness] = useState<any>(null);
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchBusiness = async () => {
            if (!userId) return;
            const response = await get_business(userId);
            if (response.status === 200) {
                setNewBusiness(response.user);
                setBusinessName(response.user?.business_name || '');
                setDescription(response.user?.business_description || '');
                setAddress(response.user?.business_address || '');
                setPhonenumber(response.user?.business_phonenumber || '');
            }
        };
        fetchBusiness();
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        const updatedBusiness = {
            business_name: businessName,
            business_description: description,
            business_address: address,
            business_phonenumber: phonenumber
        };

        await create_business(userId, updatedBusiness);
        setIsOpen(false);
    };

    if (!newBusiness) return <div>Loading...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Edit Business</h1>
            <Button onClick={() => setIsOpen(true)}>Edit Business Info</Button>
            <Modal show={isOpen} onClose={() => setIsOpen(false)}>
                <Modal.Header>Edit Business Details</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="businessName">Business Name</Label>
                            <TextInput
                                id="businessName"
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Business Description</Label>
                            <TextInput
                                id="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="address">Address</Label>
                            <TextInput
                                id="address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phonenumber">Phone Number</Label>
                            <TextInput
                                id="phonenumber"
                                type="text"
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                            />
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EditBusinessPage;