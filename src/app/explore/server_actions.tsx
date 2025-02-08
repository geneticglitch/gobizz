"use server"
import prisma from '@/lib/prisma';

export const get_non_null_businesses = async () => {
    try {
        const businesses = await prisma.user.findMany({
            where: {
                business_name: {
                    not: null,
                },
                business_description: {
                    not: null,
                },
                business_address: {
                    not: null,
                },
                business_phonenumber: {
                    not: null,
                },
            },
        });
        console.log('businesses:', businesses);
        return { status: 200, businesses };
    } catch (error) {
        console.error('An error occurred while getting the businesses:', error);
        return { status: 400, error: 'An error occurred while getting the businesses.' };
    }
};