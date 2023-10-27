import style from "../styles/Home.module.css";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";

export default function MedForm({ medications, setMedications, setShow, QR, setQR }) {
  const [Med, setMed] = useState("");
  return (
    <Form
      className={style.medForm}
      onSubmit={(ev) => {
        ev.preventDefault();
        const { medName, appearance, quantity, usage, obs } = ev.target;
        const updatedMeds = medications;
        updatedMeds.push({
          name: medName.value,
          qtd: quantity.value,
          usage: usage.value,
          obs: obs.value,
        });
        setMedications(updatedMeds);
        const updatedQ = QR;
        updatedQ.push({
          name: medName.value,
          qtd: quantity.value,
        });
        setQR(updatedQ);
        setShow(false);
      }}
    >
      <Form.Group className={style.medFormGroup}>
        <div className={style.formRow}>
          <Form.Label htmlFor="medName"> Name of Medicine* </Form.Label>
{/* {          <Form.Control type="text" name="medName" id="medName" required /> */}
          <Form.Control
              as="select"
              name="medName"
              id="medName"
              value={Med}
              onChange={(ev) => setMed(ev.target.value)}
              required
            >
              <option value="">Select The Medicine</option>
              <option value="Paracetamol" id="2001">Paracetamol</option>
              <option value="Paracetamol 650">Paracetamol 650</option>
              <option value="Azithromycin">Azithromycin</option>
              <option value="Aspirin">Aspirin</option>
            </Form.Control>
        </div>
        {/* <div>
          <Form.Label htmlFor="appearance">Apresentação</Form.Label>
          <Form.Control type="text" name="appearance" id="appearance" />
        </div> */}
        <div style={{ width: "15%", marginLeft: "5px" }}>
          <Form.Label htmlFor="quantity"> Quantity* </Form.Label>
          <Form.Control type="number" name="quantity" id="quantity" required />
        </div>
      </Form.Group>
      <Form.Label htmlFor="usage"> Usage* </Form.Label>
      <Form.Control
        as="textarea"
        name="usage"
        id="usage"
        style={{ height: "100px" }}
        required
      />
      <Form.Label htmlFor="quantity"> Observation </Form.Label>
      <Form.Control type="text" name="obs" id="obs" />
      <div className={style.btnConteiner}>
        <Button variant="secondary" type="submit">
          {" "}
          Add Medicine{" "}
        </Button>
        <Button variant="danger" onClick={() => setShow(false)} type="button">
          {" "}
          Cancel{" "}
        </Button>
      </div>
    </Form>
  );
}
