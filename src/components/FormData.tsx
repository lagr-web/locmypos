//components/formdata.tsx

import { IonAlert, IonButton, IonCol, IonGrid, IonIcon, IonInput, IonLabel, IonRow, IonTextarea } from "@ionic/react";
import { close } from "ionicons/icons";
import supabase from "./supabase-client";
import { FormEvent, useState } from "react";

type proptype = {

    position: number[],
    img: string

}

const FormData: React.FC<proptype> = ({ position, img }) => {



    const [location, setLocation] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const formCon = document.querySelector("#myFormContainer") as HTMLDivElement;
    const cameraCon = document.querySelector("#cameraimage") as HTMLDivElement;


    const addLocation = async (e: FormEvent<HTMLElement>) => {

        e.preventDefault();

        let { data, error } = await supabase
            .from('mapmyplace')
            .insert({

                location: location,
                comment: comment,
                latitude: position[0],
                longitude: position[1],
                image: img

            })

        if (error) {
            alert(error?.message);
        } else {

            const hideForm = setTimeout(() => {

                console.log("done settimeout");
                formCon.style.display = "none";
                cameraCon.style.display = "none";
                console.log("din position er gemt");
                setShowAlert(true);


            }, 500)

        }
    }

    const closeLocation = () => {

        formCon.style.display = "none";
        cameraCon.style.display = "none";

    }


    return (
        <>
            <div id="myFormContainer">

                <IonGrid>
                    <form>

                        <IonRow>
                            <IonCol>
                                <IonIcon icon={close} size="large" style={{ float: "right" }} onClick={closeLocation} />
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            <IonCol>
                                <IonLabel>Location</IonLabel>
                                <IonInput
                                    type="text"
                                    onIonChange={(event) => { setLocation((event.target.value as string) || '') }}
                                />
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            <IonCol>
                                <IonLabel>Comment</IonLabel>
                                <IonTextarea
                                    onIonChange={(event) => { setComment((event.target.value as string) || '') }}

                                />
                            </IonCol>
                        </IonRow>
                        <IonRow text-right>
                            <IonCol>
                                <IonButton onClick={addLocation}>Submit</IonButton>
                            </IonCol>
                        </IonRow>

                    </form>

                </IonGrid>

            </div>

            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                cssClass='my-custom-class'
                header={location ?? 'Unknown Location'}
                message={'Din position er gemt.'}
                buttons={['OK']}
            />

        </>


    )
}

export default FormData;