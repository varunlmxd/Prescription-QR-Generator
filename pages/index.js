import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import style from "../styles/Home.module.css";
import Head from "next/head";
import MedForm from "../components/medForm";
import MedCard from "../components/medCard";
import { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [medications, setMedications] = useState([]);
  const [QR, setQR] = useState([]);
  const [fullname, setFullname] = useState("");
  const [Age, setAge] = useState("");
  const [Sex, setSex] = useState("");
  const [copie, setCopie] = useState(true);
  const [showMedsForm, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    const prescriptionData = {
      Age,
      Sex,
      fullname,
      medications,
      QR,
    };
    setLoading(true);
    await fetch(`/api/prescription/generate`, {
      method: "POST",
      body: JSON.stringify(prescriptionData),
    });
    if (copie) {
      await fetch("/api/prescription/generateCopie");
    }
    window.open("/output.pdf");
    setLoading(false);
  };

  const removeMed = (index) => {
    const updated = medications.filter((_med, i) => i !== index);
    const updatedQR = QR.filter((_med, i) => i !== index);
    setMedications(updated);
    setQR(updatedQR);
  };

  return (
    <>
      <Head>
        <title>Prescript</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <main className={style.mainConteiner}>
        <h1> AYUSH Hospital </h1>
        <Form>
          <Form.Group>
            <div>
              <Form.Label htmlFor="name"> Name </Form.Label>
              <Form.Control
                type="text"
                name="fullname"
                id="fullname"
                value={fullname}
                onChange={(ev) => setFullname(ev.target.value)}
                min="6"
                required
              />
              <Form.Label htmlFor="age"> Age </Form.Label>
              <Form.Control
                type="number"
                name="age"
                id="age"
                value={Age}
                onChange={(ev) => setAge(ev.target.value)}
                min="6"
                required
              />
              <Form.Label htmlFor="age"> Sex </Form.Label>
              <Form.Control
              as="select"
              name="sex"
              id="sex"
              value={Sex}
              onChange={(ev) => setSex(ev.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Control>
            </div>
          </Form.Group>
        </Form>
        {showMedsForm ? (
          <MedForm
            medications={medications}
            setMedications={setMedications}
            setShow={setShow}
            QR={QR}
            setQR={setQR}
          />
        ) : (
          <>
            <div className={style.addMedBtn}>
              <h4> Medicine </h4>
              <Button variant="dark" onClick={() => setShow(true)}>
                Add Medicine <FontAwesomeIcon icon={faPlusCircle} />
              </Button>
            </div>
            {medications &&
              medications.map((med, index) => (
                <MedCard
                  med={med}
                  id={index}
                  key={index}
                  removeMed={removeMed}
                />
              ))}
          </>
        )}
        {!showMedsForm && (
          <Button
            variant="success"
            type="button"
            style={{ margin: "20px 0" }}
            onClick={() => generatePDF()}
            disabled={medications.length === 0 && true}
          >
            {loading ? (
              <Spinner
                as="span"
                size="sm"
                role="status"
                aria-hidden="true"
                animation="border"
              />
            ) : (
              "Generate Prescreption"
            )}
          </Button>
        )}
      </main>
    </>
  );
}
