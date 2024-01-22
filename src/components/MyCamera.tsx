//components/MyCamera.tsx

import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { IonButton, IonFab, IonFabButton, IonIcon, IonImg, IonicSafeString } from "@ionic/react";
import { camera, close } from 'ionicons/icons';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import L, { divIcon, LatLngExpression } from "leaflet";
import FormData from "./FormData";
import { uploadFile } from './getData';

/* type mPos<T> = {
    position:T;
} */

type mPos = {
    position: number[];
}

//const MyCamera:React.FC<mPos<number[]>> = ({ position }) => {
//const MyCamera = ({position}:mPos) => {

const MyCamera:React.FC<mPos> = ({position}) => {


    const formContainer = document.querySelector('#myFormContainer') as HTMLElement | null;

    //console.log(position);

    const [photos, setPhotos] = useState<string>("");
    const [filenameDB, setFilenameDB] = useState("");

    useEffect(() => {

        defineCustomElements(window);

    }, [])


    const takePhoto = async () => {

        const photo = await Camera.getPhoto({

            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 50

        }).catch(() => {

            throw new Error();
        })

        //const imageUrl = photo.path || photo.webPath;
        const imageUrl: string = (photo.path !== undefined ? photo.path : photo.webPath) || '';
        const newPath: string = Capacitor.convertFileSrc(imageUrl);
        setPhotos(newPath);

    }

    const closePhoto = () => {

        setPhotos('');
    }

    const uploadImage = async (path: string) => {

        uploadFile(path, "image-mapmyplace")
            .then(response => setFilenameDB(response))

        if (formContainer) formContainer.style.display = "grid";

    }


    return (
        <>

            <FormData position={position} img={filenameDB} />

            {photos ? (

                <div id="cameraimage">

                    <div id="closephoto"><IonIcon icon={close} onClick={closePhoto} /></div>

                    <IonImg src={photos} />
                    <div id="saveImgContainer">
                        <IonButton color="tertiary" onClick={async () => { await uploadImage(photos) }}>Gem billede</IonButton>
                    </div>

                </div>


            ) : (<></>)

            }

            <IonFab
                vertical="bottom"
                horizontal="center"
            >

                <IonFabButton onClick={takePhoto}>

                    <IonIcon icon={camera} />

                </IonFabButton>

            </IonFab>

            <div id="saved"><span>Gemmer billede</span></div>

        </>
    )

}

export default MyCamera;