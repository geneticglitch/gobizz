'use client'
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { get_buisness, create_buisness } from "./server_actions";


const EditBusinessPage: React.FC = () => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const [business, setBusiness] = useState<any>(null);
    const [newBusiness, setNewBusiness] = useState<any>(null);
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    useEffect(() => {
        const buisnessName = async () => {
          if (!userId) return;
            const businessData = await get_buisness(userId);
        };
        fetchProducts();
    }, [userId]);


    if (!business) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Edit Business</h1>
            <form>
                <div>
                    <Label htmlFor="name">Business Name</Label>
                    <TextInput id="name" type="text" value={business.name} />
                </div>
                <div>
                    <Label htmlFor="address">Address</Label>
                    <TextInput id="address" type="text" value={business.address} />
                </div>
                <Button type="submit">Save Changes</Button>
            </form>
        </div>
    );
};

export default EditBusinessPage;