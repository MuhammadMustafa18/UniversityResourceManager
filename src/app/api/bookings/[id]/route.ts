import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { status } = body

        const booking = await prisma.booking.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json(booking)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 })
    }
}
