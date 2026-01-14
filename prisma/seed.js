const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const resources = [
        {
            name: 'Computer Lab 1',
            type: 'Lab',
            description: 'High-performance workstations for CS students.',
            location: 'Block A, 2nd Floor',
        },
        {
            name: 'Main Auditorium',
            type: 'Hall',
            description: 'Large hall for seminars and events.',
            location: 'Administrative Block',
        },
        {
            name: 'Physics Lab',
            type: 'Lab',
            description: 'Equipped for optics and mechanics experiments.',
            location: 'Science Block, Ground Floor',
        },
        {
            name: 'Projector #101',
            type: 'Equipment',
            description: 'Portable 4K projector.',
            location: 'Library Storage',
        },
    ]

    for (const r of resources) {
        await prisma.resource.create({
            data: r,
        })
    }

    console.log('Seed data created successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
