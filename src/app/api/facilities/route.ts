import { CATALOG_FACILITIES, findNearestDistrict, generateDynamicFacilities } from '@/lib/facilityCatalog';
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
    const radiusParam = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : null;

    // 1. Query Prisma DB facilities
    const where: any = {};
    if (district && district !== 'ALL' && district !== 'NEARBY') {
      where.district = { contains: district };
    }
    if (type && type !== 'ALL') {
      where.type = type;
    }

    const dbFacilities = await prisma.facility.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    const parsedDb = dbFacilities.map((f) => {
      let parsedServices: string[] = [];
      try {
        parsedServices = JSON.parse(f.services);
      } catch {}
      return {
        id: f.id,
        name: f.name,
        nameHi: f.nameHi,
        type: f.type as any,
        district: f.district,
        block: f.block,
        address: f.address,
        phone: f.phone,
        lat: f.lat,
        lng: f.lng,
        openingHours: f.openingHours,
        servicesList: parsedServices,
        isSampleData: f.isSampleData,
        distanceKm: null as number | null,
      };
    });

    // 2. Fetch Catalog facilities
    let matchingCatalog = CATALOG_FACILITIES;
    if (district && district !== 'ALL' && district !== 'NEARBY') {
      matchingCatalog = matchingCatalog.filter(
        (f) => f.district.toLowerCase() === district.toLowerCase()
      );
    }
    if (type && type !== 'ALL') {
      matchingCatalog = matchingCatalog.filter((f) => f.type === type);
    }

    // Merge DB + Catalog without duplicates
    const combinedMap = new Map<string, any>();
    for (const f of parsedDb) {
      combinedMap.set(`${f.name.toLowerCase()}_${f.district.toLowerCase()}`, f);
    }
    for (const f of matchingCatalog) {
      const key = `${f.name.toLowerCase()}_${f.district.toLowerCase()}`;
      if (!combinedMap.has(key)) {
        combinedMap.set(key, f);
      }
    }

    let allFacilities = Array.from(combinedMap.values());

    // 3. User GPS coordinates calculation
    const hasCoordinates =
      userLat !== null &&
      userLng !== null &&
      !isNaN(userLat) &&
      !isNaN(userLng);

    if (hasCoordinates) {
      allFacilities = allFacilities.map((f) => ({
        ...f,
        distanceKm: calculateDistanceKm(userLat, userLng, f.lat, f.lng),
      }));

      // Check how many facilities are within 30 km of the user
      const nearbyFacilities = allFacilities.filter(
        (f) => f.distanceKm !== null && f.distanceKm <= 30
      );

      // If user is anywhere in India and has fewer than 6 facilities nearby
      if (nearbyFacilities.length < 6) {
        const { district: nearestDist } = findNearestDistrict(userLat, userLng);
        const dynamicCluster = generateDynamicFacilities(userLat, userLng, nearestDist);

        let filteredDynamic = dynamicCluster;
        if (type && type !== 'ALL') {
          filteredDynamic = filteredDynamic.filter((f) => f.type === type);
        }

        for (const df of filteredDynamic) {
          allFacilities.push(df);
        }
      }

      // Re-sort strictly by distance ascending
      allFacilities.sort((a, b) => {
        if (a.distanceKm === null || a.distanceKm === undefined) return 1;
        if (b.distanceKm === null || b.distanceKm === undefined) return -1;
        return a.distanceKm - b.distanceKm;
      });

      // Filter by radius if provided
      if (radiusParam && radiusParam > 0) {
        allFacilities = allFacilities.filter(
          (f) => f.distanceKm !== null && f.distanceKm !== undefined && f.distanceKm <= radiusParam
        );
      }
    }

    return NextResponse.json({
      success: true,
      facilities: allFacilities,
      total: allFacilities.length,
      userLocation: hasCoordinates ? { lat: userLat, lng: userLng } : null,
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
