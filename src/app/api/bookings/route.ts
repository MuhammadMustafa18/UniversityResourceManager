import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('resourceId')
    const userId = searchParams.get('userId')

    try {
        const bookings = await prisma.booking.findMany({
            where: {
                ...(resourceId && { resourceId }),
                ...(userId && { userId }),
            },
            include: {
                resource: true,
            },
            orderBy: { startTime: 'asc' },
        })
        return NextResponse.json(bookings)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { resourceId, startTime, endTime, userId, userName, purpose } = body

        const start = new Date(startTime)
        const end = new Date(endTime)

        // Backend Validation for Double-Booking
        const conflicts = await prisma.booking.findFirst({
            where: {
                resourceId,
                status: { in: ['Pending', 'Approved'] },
                OR: [
                    {
                        startTime: { lt: end },
                        endTime: { gt: start },
                    },
                ],
            },
        })

        if (conflicts) {
            return NextResponse.json(
                { error: 'This resource is already booked for the selected time slot.' },
                { status: 409 }
            )
        }

        const booking = await prisma.booking.create({
            data: {
                resourceId,
                userId,
                userName,
                startTime: start,
                endTime: end,
                purpose,
                status: 'Pending',
            },
        })

        return NextResponse.json(booking)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }
}
