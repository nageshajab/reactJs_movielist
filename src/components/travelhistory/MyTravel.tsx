import {
  GoogleMap,
  LoadScript,
  Polyline,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import React, { useState } from "react";

const containerStyle = { width: "100%", height: "600px" };
const center = { lat: 21.7679, lng: 78.8718 };

const pune = { lat: 18.5204, lng: 73.8567 };
const hyderabad = { lat: 17.385, lng: 78.4867 }; // Hyderabad, Telangana
const dubai = { lat: 25.276987, lng: 55.296249 };
const abuDhabi = { lat: 24.4539, lng: 54.3773 };
const chennai = { lat: 13.0827, lng: 80.2707 };
const shimla = { lat: 31.1048, lng: 77.1734 };
const kullu = { lat: 31.9566, lng: 77.1095 };
const manali = { lat: 32.2432, lng: 77.1892 };
const jaipur = { lat: 26.9124, lng: 75.7873 };
const agra = { lat: 27.1767, lng: 78.0081 }; // Agra, Uttar Pradesh
const nainital = { lat: 29.3919, lng: 79.4542 }; // Nainital, Uttarakhand
const bangkok = { lat: 13.7563, lng: 100.5018 }; // Bangkok, Thailand
const pattaya = { lat: 12.9236, lng: 100.8825 };
const phuket = { lat: 7.8804, lng: 98.3923 };
const kanyakumari = { lat: 8.0883, lng: 77.5385 }; // Kanyakumari, Tamil Nadu
const jaisalmer = { lat: 26.9157, lng: 70.9083 }; // Jaisalmer, Rajasthan
const udaipur = { lat: 24.5854, lng: 73.7125 };
const delhi = { lat: 28.6139, lng: 77.209 }; // Delhi, India
const surat = { lat: 21.1702, lng: 72.8311 }; // Surat, Gujarat
const goa = { lat: 15.2993, lng: 74.124 }; // Goa, India
const alibag = { lat: 18.6414, lng: 72.8722 }; // Alibag, Maharashtra
const aurangabad = { lat: 19.8762, lng: 75.3433 }; // Aurangabad, Maharashtra
const bharuch = { lat: 21.7057, lng: 72.9982 }; // Bharuch, Gujarat

const visitedPlaces = [
  { position: pune, label: "Pune - home base" },
  { position: delhi, label: "Delhi - Dec 2007" },
  { position: shimla, label: "Shimla - Dec 2007" },
  { position: kullu, label: "Kullu - Dec 2007" },
  { position: manali, label: "Manali - Dec 2007" },
  { position: chennai, label: "Chennai - Sept 2008" },
  { position: surat, label: "Surat - Nov 2011" },
  { position: jaipur, label: "Jaipur - Nov 2011" },
  { position: jaisalmer, label: "Jaisalmer - Nov 2011" },
  { position: udaipur, label: "Udaipur - Nov 2011" },
  { position: bharuch, label: "Bharuch - Sept 2025" },
  { position: aurangabad, label: "Aurangabad - Dec 2013" },
  { position: agra, label: "Agra - Dec 2015" },
  { position: goa, label: "Goa - Sept 2016" },
  { position: nainital, label: "Nainital - Dec 2018" },
  { position: hyderabad, label: "Hyderabad - Aug 2018" },
  { position: dubai, label: "Dubai - May 2023" },
  { position: abuDhabi, label: "Abu Dhabi - May 2023" },
  { position: alibag, label: "Alibag - May 2024" },
  { position: bangkok, label: "Bangkok - April 2025" },
  { position: pattaya, label: "Pattaya - April 2025" },
  { position: phuket, label: "Phuket - April 2025" },
  { position: kanyakumari, label: "Kanyakumari - Oct 2025" },
];
const routes = [
  { from: pune, to: delhi, label: "delhi - dec 2007" },
  { from: delhi, to: shimla, label: "Shimla - dec 2007" },
  { from: shimla, to: kullu, label: "Kullu - dec 2007" }, // ✅ New route
  { from: kullu, to: manali, label: "Manali - dec 2007" },

  { from: pune, to: chennai, label: "Chennai - sept 2008" },

  { from: pune, to: surat, label: "surat - nov 2011" },
  { from: surat, to: jaipur, label: "Jaipur - nov 2011" },
  { from: jaipur, to: jaisalmer, label: "jaisalmer - nov 2011" }, // ✅ New route
  { from: jaisalmer, to: udaipur, label: "udaipur - nov 2011" }, // ✅ New route
  { from: udaipur, to: surat, label: "surat - nov 2011" }, // ✅ New route

  { from: pune, to: aurangabad, label: "aurangabad - dec 2013" },
  { from: pune, to: agra, label: "agra - dec 2015" },

  { from: pune, to: goa, label: "goa - sept 2016" },

  { from: pune, to: nainital, label: "Nainital - dec 2018" },

  { from: pune, to: hyderabad, label: "hyderabad - august 2018" },

  { from: pune, to: dubai, label: "Dubai - may 2023" },
  { from: dubai, to: abuDhabi, label: "abuDhabi - may 2023" },

  { from: pune, to: alibag, label: "alibag - may 2024" },

  { from: pune, to: bangkok, label: "Bangkok - april 2025" },
  { from: bangkok, to: pattaya, label: "pattaya - april 2025" },
  { from: pattaya, to: phuket, label: "phuket - april 2025" },

  { from: pune, to: kanyakumari, label: "Kanyakumari - oct 2025" },
];

export default function MapWithLabels() {
  const [activeLabel, setActiveLabel] = useState<number | null>(null);
  const [mapType, setMapType] = useState("roadmap");

  return (
    <LoadScript googleMapsApiKey="AIzaSyBbOFjfwEsYi3fa-Hz4X75DeLTSCBQSn64">
      <select onChange={(e) => setMapType(e.target.value)}>
        <option value="roadmap">Roadmap</option>
        <option value="satellite">Satellite</option>
        <option value="hybrid">Hybrid</option>
        <option value="terrain">Terrain</option>
      </select>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        options={{ mapTypeId: mapType }}
      >
        {visitedPlaces.map((place, index) => (
          <React.Fragment key={index}>
            <Marker
              position={place.position}
              onClick={() => setActiveLabel(index)}
              label={{
                text: place.label.split(" - ")[0],
                fontSize: "12px",
                color: "#000",
              }}
            />
            {activeLabel === index && (
              <InfoWindow
                position={place.position}
                onCloseClick={() => setActiveLabel(null)}
              >
                <div>{place.label}</div>
              </InfoWindow>
            )}
          </React.Fragment>
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
