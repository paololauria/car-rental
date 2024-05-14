import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CarDto } from "../../model/car/CarDto";

interface CarFormProps {
  initialValues: CarDto;
  onSubmit: (values: CarDto) => void;
  onCancel: () => void;
}

const CarForm: React.FC<CarFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const validationSchema = Yup.object().shape({
    brand: Yup.string().required("La marca è obbligatoria"),
    model: Yup.string().required("Il modello è obbligatorio"),
    plate: Yup.string().required("La targa è obbligatoria"),
    price: Yup.number().required("Il prezzo è obbligatorio"),
    image: Yup.string().url("Deve essere un URL valido"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      {() => (
        <Form>
          <div className="flex flex-col gap-4">
            <Field
              type="text"
              name="brand"
              placeholder="Marca"
              className="input input-bordered"
            />
            <ErrorMessage
              name="brand"
              component="div"
              className="text-red-500"
            />
            <Field
              type="text"
              name="model"
              placeholder="Modello"
              className="input input-bordered"
            />
            <ErrorMessage
              name="model"
              component="div"
              className="text-red-500"
            />
            <Field
              type="text"
              name="plate"
              placeholder="Targa"
              className="input input-bordered"
            />
            <ErrorMessage
              name="plate"
              component="div"
              className="text-red-500"
            />
            <Field
              type="number"
              name="price"
              placeholder="Prezzo/giorno"
              className="input input-bordered"
            />
            <ErrorMessage
              name="price"
              component="div"
              className="text-red-500"
            />
            <Field
              type="text"
              name="image"
              placeholder="Immagine"
              className="input input-bordered"
            />
            <ErrorMessage
              name="image"
              component="div"
              className="text-red-500"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="btn btn-primary">
              Salva
            </button>
            <button type="button" onClick={onCancel} className="btn btn-ghost">
              Annulla
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CarForm;
