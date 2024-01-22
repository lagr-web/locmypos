//npm install --save @types/leaflet @types/geojson
//components/MyMap.tsx

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { divIcon, LatLngExpression } from "leaflet";
import './myMap.scss';
import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { IonCol, IonImg, IonLoading, IonRow } from "@ionic/react";
import MyCamera from "./MyCamera";
import { fetchLocation } from "./getData";
import supabase from "./supabase-client";

//https://supabase.com/docs/reference/javascript/storage-from-update

/*
 
const { data } = supabase
.storage
.from('public-bucket')
.getPublicUrl('folder/avatar1.png')


*/

interface loc {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitudeAccuracy: number | null | undefined;
    altitude: number | null; speed: number | null;
    heading: number | null;

}

interface IconOptions {
    iconUrl: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    popupAnchor: [number, number];
}

interface markerPositions {
    image: string;
    location: string;
    comment: string;
    latitude: number;
    longitude: number;
}


const MyMap: React.FC = ( ) => {

    const position: LatLngExpression = [56.52635293804066, 9.614244537563335];

    const [myspot, setMySpot] = useState<L.Icon | null>(null);
    const [spots, setSpots] = useState<L.Icon | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [myPosition, setMyPostion] = useState<loc | null>(null);
    const [showLoading, setShowloading] = useState<boolean>(true);
    const [dbData, setDbData] = useState<markerPositions[] | null>([]);


    const url = "https://woumnidrxvcievydosww.supabase.co/storage/v1/object/public/image-mapmyplace/";

    const markerPositions:markerPositions[]= [

        {
            image: "assets/position-images/spot-icon.jpg",
            location: "Skæring",
            comment: "Skæring",
            latitude: 56.2314977010896,
            longitude: 10.320953067889777,
        },
        {
            image: "/assets/position-images/spot-icon.jpg",
            location: "Ebeltoft",
            comment: "glasmuseet",
            latitude: 56.19656102762782,
            longitude: 10.678123381787396,
        },
        {
            image: "/assets/position-images/spot-icon.jpgg",
            location: "Lønstrup",
            comment: "lønstrup",
            latitude: 57.47520549523601,
            longitude: 9.797069303027442,
        },
        {
            image: "/assets/position-images/spot-icon.jpg",
            location: "Kalyves",
            comment: "Provlita",
            latitude: 35.45508926793525,
            longitude: 24.171037403669782,
        },
        {
            image: "/assets/position-images/spot-icon.jpg",
            location: "Kalyves",
            comment: "Dimitra",
            latitude: 35.456922591535694,
            longitude: 24.167508999612433,
        },
        {
            image: "/assets/position-images/spot-icon.jpg",
            location: "Kalyves",
            comment: "Cactus coffee",
            latitude: 35.45797294238098,
            longitude: 24.16576565846501,
        }
    ];

    const defaultIconOptions: IconOptions = {
        iconUrl: "/assets/my-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    };


    useEffect(() => {

        const mSpot: IconOptions = {
            iconUrl: "/assets/my-icon.png",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, 0]
        };

        const spot = L.icon(mSpot);
        setMySpot(spot);


        const uSpot: IconOptions = {
            iconUrl: "/assets/spot-icon.png",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, 0]
        };

        const useSpot = L.icon(uSpot);
        setSpots(useSpot);

        (async () => {

            try {

                const coordinates = await Geolocation.getCurrentPosition();
                setMyPostion(coordinates.coords);

            } catch (error) {

                console.error('Error fetching data', error);

            } finally {

                setLoading(false)

            }//END

        })()//END selfinvoked function

        fetchLocation("mapmyplace")
            .then(response => setDbData(response));

        console.log(dbData);

        const { data } = supabase
            .storage
            .from('')
            .getPublicUrl('myimage-1691744369367.jpg')

        //console.log(data.publicUrl);


    }, [])


    if (error) return <div>error</div>;

    if (loading)

        return (

            <IonLoading
                spinner={'bubbles'}
                isOpen={showLoading}
                onDidDismiss={() => setShowloading(false)}
                message={"Vent lige lidt ... henter kortdata"}
                duration={5000}

            />

        )


    return (

        <div id="content">

            <MapContainer center={position} zoom={7} scrollWheelZoom={true}>

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker
                    position={

                        myPosition ? [myPosition.latitude, myPosition.longitude] as LatLngExpression
                            : [56.52635293804066, 9.614244537563335]
                    }

                    icon={myspot || L.icon(defaultIconOptions)}
                >
                    <Popup>Im here</Popup>

                </Marker>

                {dbData &&

                    dbData.map((data: markerPositions, index: number) => (

                        <Marker
                            key={"map" + index}
                            position={[data.latitude, data.longitude]}
                            icon={spots || L.icon(defaultIconOptions)}
                        >
                            <Popup>
                                <IonRow>
                                    <IonImg src={url + data.image} />
                                </IonRow>
                                <IonRow className="headline">{data.location}</IonRow>
                                <IonRow className="comment">{data.comment}</IonRow>
                                <IonRow>
                                    <IonCol className="geolocation">{`${data.latitude}${data.longitude}`}</IonCol>
                                </IonRow>
                            </Popup>

                        </Marker>

                    ))//END loop

                }


            </MapContainer>

            <MyCamera position={myPosition ? [myPosition.latitude, myPosition.longitude] : [0, 0]} />

        </div>

    )

}
export default MyMap;