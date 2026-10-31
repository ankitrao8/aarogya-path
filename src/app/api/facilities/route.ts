import { calculateDistanceKm } from '@/lib/geo';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const type = searchParams.get('type');
    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const userLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
    const level = searchParams.get('level'); // RED, ORANGE, YELLOW, GREEN

    const where: any = {};
    if (district && district !== 'ALL') {
      where.district = { contains: district };
    }
    if (type && type !== 'ALL') {
      where.type = type;
    }

    const facilities = await prisma.facility.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    const enriched = facilities.map((f) => {
      let distanceKm: number | null = null;
      if (userLat !== null && userLng !== null && !isNaN(userLat) && !isNaN(userLng)) {
        distanceKm = calculateDistanceKm(userLat, userLng, f.lat, f.lng);
      }

      let parsedServices: string[] = [];
      try {
        parsedServices = JSON.parse(f.services);
      } catch {}

      return {
        ...f,
        servicesList: parsedServices,
        distanceKm,
      };
    });

    // Sort by distance if location provided
    if (userLat !== null && userLng !== null) {
      enriched.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return NextResponse.json({
      success: true,
      facilities: enriched,
      total: enriched.length,
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if bulk CSV import
    if (Array.isArray(body)) {
      const created = [];
      for (const item of body) {
        const fac = await prisma.facility.create({
          data: {
            name: item.name,
            nameHi: item.nameHi || null,
            type: item.type,
            district: item.district,
            block: item.block || null,
            address: item.address,
            phone: item.phone,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng),
            services: typeof item.services === 'string' ? item.services : JSON.stringify(item.services || []),
            openingHours: item.openingHours || '24x7',
            isSampleData: item.isSampleData !== undefined ? Boolean(item.isSampleData) : true,
          },
        });
        created.push(fac);
      }
      return NextResponse.json({ success: true, count: created.length });
    }

    // Single creation
    const fac = await prisma.facility.create({
      data: {
        name: body.name,
        nameHi: body.nameHi || null,
        type: body.type,
        district: body.district,
        block: body.block || null,
        address: body.address,
        phone: body.phone,
        lat: parseFloat(body.lat),
        lng: parseFloat(body.lng),
        services: typeof body.services === 'string' ? body.services : JSON.stringify(body.services || []),
        openingHours: body.openingHours || '24x7',
        isSampleData: body.isSampleData !== undefined ? Boolean(body.isSampleData) : false,
      },
    });

    return NextResponse.json({ success: true, facility: fac });
  } catch (error) {
    console.error('Error creating facility:', error);
    return NextResponse.json({ error: 'Failed to create facility' }, { status: 500 });
  }
}
