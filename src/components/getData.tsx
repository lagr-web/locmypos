//components/getData.tsx

import supabase from "./supabase-client";
import Compressor from "compressorjs";

export const uploadFile = async (path: string, to_storage: string) => {

  const saved = document.querySelector("#saved") as HTMLDivElement;
  const formCon = document.querySelector("#myFormContainer") as HTMLDivElement;

  saved.style.display = "block";

  const response = await fetch(path);
  const blob = await response.blob();

  const time = new Date().getTime();
  const fileName = `${"myimage"}-${time}.jpg`;

  new Compressor(blob, {
    quality: 0.1,
    convertTypes: ["image/jpeg", "image/png"],
    convertSize: 10000,
    success: (compressedResult: Blob) => {
      console.log(compressedResult);

      myUpload(to_storage, fileName, compressedResult, [saved, formCon]);
    },
  });

  return fileName;

};

export const myUpload = async (ts: string, fn: string, bl: Blob, obj: HTMLElement[]) => {


  const { data, error } = await supabase.storage
    .from(ts)
    .upload(`${fn}`, bl, {
      cacheControl: "3600",
      upsert: false
    })

  if (error) {

    alert(error.message);

  } else {

    obj[0].style.display = "none";
    obj[1].style.display = "grid";
  }

};

export const fetchLocation = async (dbTable: any) => {

  const { data: mloc } = await supabase
    .from(dbTable)
    .select('*')
    .order('location')

  return mloc

}

