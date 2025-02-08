'use server';

import prisma from '@/lib/prisma';

export async function get_business(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                business_name: true,
                business_description: true,
                business_address: true,
                business_phonenumber: true,
            },
        });

        if (!user) return { status: 404, message: "Business not found" };
        return { status: 200, user };
    } catch (error) {
        return { status: 500, message: "Internal Server Error" };
    }
}

export async function create_business(userId: string, data: any) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                business_name: data.business_name,
                business_description: data.business_description,
                business_address: data.business_address,
                business_phonenumber: data.business_phonenumber,
            },
        });

        return { status: 200, user: updatedUser };
    } catch (error) {
        return { status: 500, message: "Error updating business" };
    }
}