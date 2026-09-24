from typing import Dict, List, Any
from .models import ZoneInfo

ZONES: Dict[str, ZoneInfo] = {
    "c-scheme": ZoneInfo(
        zone_id="c-scheme",
        name="C-Scheme & MI Road",
        display_title="C-Scheme & MI Road Central Corridor",
        subtitle="Government secretariats, commercial corridors, and primary stormwater catchment",
        center=[75.8016, 26.9124],
        bounds=[[75.785, 26.898], [75.820, 26.928]],
        population_est=185000,
        transit_corridors=["Mirza Ismail (MI) Road", "Ashok Marg", "Bhagwan Das Road", "Statue Circle Radial"]
    ),
    "pink-city": ZoneInfo(
        zone_id="pink-city",
        name="Pink City (Walled Heritage)",
        display_title="Pink City Heritage Grid",
        subtitle="Dense heritage markets, high pedestrian density, and historic bazaar streets",
        center=[75.8242, 26.9239],
        bounds=[[75.810, 26.915], [75.845, 26.935]],
        population_est=320000,
        transit_corridors=["Johari Bazaar", "Tripolia Bazaar", "Badi Chaupar", "Ajmeri Gate Corridor"]
    ),
    "malviya-nagar": ZoneInfo(
        zone_id="malviya-nagar",
        name="Malviya Nagar & JLN Marg",
        display_title="Malviya Nagar & Tech Corridor",
        subtitle="Arterial highway connectivity, educational institutes, and major commercial hubs",
        center=[75.8185, 26.8542],
        bounds=[[75.800, 26.835], [75.835, 26.872]],
        population_est=240000,
        transit_corridors=["Jawaharlal Nehru (JLN) Marg", "Calgiri Marg", "Apex Circle Radial"]
    ),
    "mansarovar": ZoneInfo(
        zone_id="mansarovar",
        name="Mansarovar Metro Corridor",
        display_title="Mansarovar Urban Grid",
        subtitle="Mass residential sectors, metro terminus, and low-lying Dravyavati river drainage",
        center=[75.7628, 26.8601],
        bounds=[[75.740, 26.840], [75.785, 26.880]],
        population_est=390000,
        transit_corridors=["Madhyam Marg", "Mansarovar Metro Line", "Shipra Path Corridor"]
    ),
    "vaishali-nagar": ZoneInfo(
        zone_id="vaishali-nagar",
        name="Vaishali Nagar & Queens Rd",
        display_title="Vaishali Nagar Commercial Sector",
        subtitle="High-density shopping avenues, critical underpasses, and arterial intersections",
        center=[75.7420, 26.9080],
        bounds=[[75.720, 26.890], [75.765, 26.925]],
        population_est=210000,
        transit_corridors=["Queens Road", "Amrapali Circle", "Sirsi Road Crossing"]
    )
}

# Real localized transit route definitions for each zone
ZONE_TRANSIT_ROUTES = {
    "c-scheme": [
        {
            "route_id": "RT-04",
            "route_name": "Route 4: Sindhi Camp -> Statue Circle -> Tonk Phatak",
            "color": "#0284c7",
            "points": [[75.8010, 26.9230], [75.8015, 26.9180], [75.8020, 26.9124], [75.8040, 26.9060], [75.8080, 26.8980]],
            "stops": ["Sindhi Camp", "Panch Batti", "Statue Circle", "Birla Auditorium", "Rambagh Circle"]
        },
        {
            "route_id": "RT-07",
            "route_name": "Route 7: MI Road Express -> Collectorate",
            "color": "#10b981",
            "points": [[75.7920, 26.9190], [75.7970, 26.9160], [75.8040, 26.9140], [75.8120, 26.9130], [75.8190, 26.9120]],
            "stops": ["Jaipur Junction", "Collectorate", "Panch Batti", "Ajmeri Gate", "Sanganeri Gate"]
        }
    ],
    "pink-city": [
        {
            "route_id": "HERITAGE-1",
            "route_name": "Heritage E-Bus: Ajmeri Gate -> Badi Chaupar",
            "color": "#f59e0b",
            "points": [[75.8180, 26.9180], [75.8230, 26.9210], [75.8260, 26.9240], [75.8300, 26.9270]],
            "stops": ["Ajmeri Gate", "New Gate", "Johari Bazaar", "Badi Chaupar"]
        },
        {
            "route_id": "HERITAGE-2",
            "route_name": "Tripolia Circular: Chhoti Chaupar -> Hawa Mahal",
            "color": "#ea580c",
            "points": [[75.8210, 26.9260], [75.8260, 26.9240], [75.8310, 26.9230], [75.8360, 26.9240]],
            "stops": ["Chhoti Chaupar", "Tripolia Gate", "Badi Chaupar", "Hawa Mahal"]
        }
    ],
    "malviya-nagar": [
        {
            "route_id": "RT-MN-1",
            "route_name": "JLN Arterial: Gandhinagar -> Apex Circle -> Airport",
            "color": "#8b5cf6",
            "points": [[75.8050, 26.8780], [75.8120, 26.8650], [75.8185, 26.8542], [75.8100, 26.8400]],
            "stops": ["Gandhinagar Station", "World Trade Park", "Apex Circle", "Airport Terminal 2"]
        },
        {
            "route_id": "RT-MN-2",
            "route_name": "Calgiri Feeder: Malviya Nagar Sector 3 -> Jawahar Kala Kendra",
            "color": "#06b6d4",
            "points": [[75.8250, 26.8600], [75.8185, 26.8542], [75.8100, 26.8680], [75.8050, 26.8780]],
            "stops": ["Sector 3 Market", "Calgiri Hospital", "MNIT Campus", "JKK Arts Center"]
        }
    ],
    "mansarovar": [
        {
            "route_id": "METRO-FEEDER-1",
            "route_name": "Mansarovar Metro Feeder: Madhyam Marg -> Station",
            "color": "#ec4899",
            "points": [[75.7500, 26.8700], [75.7600, 26.8650], [75.7628, 26.8601], [75.7720, 26.8500]],
            "stops": ["Mansarovar Metro Station", "Varun Path", "Madhyam Marg", "VT Road Crossing"]
        }
    ],
    "vaishali-nagar": [
        {
            "route_id": "RT-VN-1",
            "route_name": "Queens Road Line: 200ft Bypass -> Amrapali Circle",
            "color": "#14b8a6",
            "points": [[75.7350, 26.9200], [75.7420, 26.9080], [75.7480, 26.8980], [75.7550, 26.8900]],
            "stops": ["Khatipura Crossing", "Amrapali Circle", "Queens Road Market", "Gandhi Path"]
        }
    ]
}

# Road segments for traffic density per zone
ZONE_TRAFFIC_SEGMENTS = {
    "c-scheme": [
        {
            "segment_id": "CS-SEG-1",
            "road_name": "Mirza Ismail (MI) Road (Collectorate to Panch Batti)",
            "coords": [[75.7970, 26.9160], [75.8010, 26.9150], [75.8050, 26.9140]],
            "free_flow": 42.0
        },
        {
            "segment_id": "CS-SEG-2",
            "road_name": "Ashok Marg (Statue Circle to Raj Mandir)",
            "coords": [[75.8020, 26.9124], [75.8040, 26.9160], [75.8070, 26.9180]],
            "free_flow": 45.0
        },
        {
            "segment_id": "CS-SEG-3",
            "road_name": "Bhagwan Das Road (Secretariat Corridor)",
            "coords": [[75.8090, 26.9170], [75.8040, 26.9124], [75.7980, 26.9090]],
            "free_flow": 40.0
        }
    ],
    "pink-city": [
        {
            "segment_id": "PC-SEG-1",
            "road_name": "Johari Bazaar (Sanganeri Gate to Badi Chaupar)",
            "coords": [[75.8200, 26.9140], [75.8230, 26.9190], [75.8260, 26.9240]],
            "free_flow": 28.0
        },
        {
            "segment_id": "PC-SEG-2",
            "road_name": "Tripolia Bazaar (Chhoti Chaupar to Badi Chaupar)",
            "coords": [[75.8210, 26.9260], [75.8240, 26.9250], [75.8260, 26.9240]],
            "free_flow": 25.0
        }
    ],
    "malviya-nagar": [
        {
            "segment_id": "MN-SEG-1",
            "road_name": "JLN Marg Expressway (Apex Circle to WTP)",
            "coords": [[75.8185, 26.8542], [75.8120, 26.8650], [75.8050, 26.8780]],
            "free_flow": 55.0
        },
        {
            "segment_id": "MN-SEG-2",
            "road_name": "Calgiri Hospital Marg",
            "coords": [[75.8250, 26.8600], [75.8185, 26.8542]],
            "free_flow": 38.0
        }
    ],
    "mansarovar": [
        {
            "segment_id": "MS-SEG-1",
            "road_name": "Madhyam Marg Arterial",
            "coords": [[75.7500, 26.8700], [75.7600, 26.8650], [75.7628, 26.8601]],
            "free_flow": 40.0
        }
    ],
    "vaishali-nagar": [
        {
            "segment_id": "VN-SEG-1",
            "road_name": "Queens Road Commercial Strip",
            "coords": [[75.7420, 26.9080], [75.7480, 26.8980]],
            "free_flow": 44.0
        }
    ]
}

# Topographic depression, catchbasin, and flood/calamity risk locations per zone
ZONE_CALAMITY_LOCATIONS = {
    "c-scheme": [
        {"id": "CS-CAL-1", "name": "Panch Batti Low Underpass", "coords": [75.8040, 26.9140], "type": "waterlogging"},
        {"id": "CS-CAL-2", "name": "Statue Circle Stormwater Siphon", "coords": [75.8020, 26.9124], "type": "drain_overflow"},
        {"id": "CS-CAL-3", "name": "Collectorate Junction Dip", "coords": [75.7970, 26.9160], "type": "waterlogging"},
        {"id": "CS-CAL-4", "name": "Ashok Marg Catchbasin Sump", "coords": [75.8070, 26.9180], "type": "road_cavity"},
        {"id": "CS-CAL-5", "name": "Bhagwan Das Secretariat Dip", "coords": [75.8090, 26.9170], "type": "waterlogging"}
    ],
    "pink-city": [
        {"id": "PC-CAL-1", "name": "Badi Chaupar Historic Sump", "coords": [75.8260, 26.9240], "type": "severe_flood"},
        {"id": "PC-CAL-2", "name": "Johari Bazaar Lower Market", "coords": [75.8230, 26.9190], "type": "waterlogging"},
        {"id": "PC-CAL-3", "name": "Ajmeri Gate Inundation Siphon", "coords": [75.8180, 26.9180], "type": "drain_overflow"},
        {"id": "PC-CAL-4", "name": "Tripolia Bazaar Gateway Dip", "coords": [75.8240, 26.9250], "type": "waterlogging"},
        {"id": "PC-CAL-5", "name": "Chhoti Chaupar Catchment Basin", "coords": [75.8210, 26.9260], "type": "waterlogging"}
    ],
    "malviya-nagar": [
        {"id": "MN-CAL-1", "name": "Apex Circle Low Underpass", "coords": [75.8185, 26.8542], "type": "waterlogging"},
        {"id": "MN-CAL-2", "name": "Calgiri Drainage Culvert", "coords": [75.8100, 26.8680], "type": "drain_overflow"},
        {"id": "MN-CAL-3", "name": "JLN Marg WTP Flyover Dip", "coords": [75.8120, 26.8650], "type": "waterlogging"},
        {"id": "MN-CAL-4", "name": "Gandhinagar Railway Low Bridge", "coords": [75.8050, 26.8780], "type": "severe_flood"}
    ],
    "mansarovar": [
        {"id": "MS-CAL-1", "name": "Dravyavati River Overbank Zone", "coords": [75.7600, 26.8650], "type": "severe_flood"},
        {"id": "MS-CAL-2", "name": "Madhyam Marg Low Basin", "coords": [75.7628, 26.8601], "type": "waterlogging"},
        {"id": "MS-CAL-3", "name": "Shipra Path Drainage Dip", "coords": [75.7500, 26.8700], "type": "drain_overflow"},
        {"id": "MS-CAL-4", "name": "VT Road Underpass Depression", "coords": [75.7720, 26.8500], "type": "waterlogging"}
    ],
    "vaishali-nagar": [
        {"id": "VN-CAL-1", "name": "Queens Road Railway Underpass", "coords": [75.7420, 26.9080], "type": "severe_flood"},
        {"id": "VN-CAL-2", "name": "Amrapali Circle Stormwater Siphon", "coords": [75.7480, 26.8980], "type": "waterlogging"},
        {"id": "VN-CAL-3", "name": "Khatipura Crossing Culvert", "coords": [75.7350, 26.9200], "type": "drain_overflow"},
        {"id": "VN-CAL-4", "name": "Gandhi Path Low Depression", "coords": [75.7550, 26.8900], "type": "waterlogging"}
    ]
}
