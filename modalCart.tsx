import React, { useEffect, useState } from 'react'
import { Button, Modal, Row, Col, Image, Badge, Alert } from 'react-bootstrap'
import InputMask from "react-input-mask"
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const URL_API = 'https://rapepoesia.com.br/api'

interface Props {
    show: boolean,
    onHide: any,
    camarote: any
}

const ModalCartCamarote : React.FC <Props> = (props:any) => {

    const [step, setStep] = useState(1)
    const data_camarote = props.camarote

    const [card, setCard] = useState({
        cvc: '',
        expiry: '',
        focus: '',
        name: '',
        number: ''
    })

    const handleInputFocus = (e:any) => {
        setCard({ ...card, focus: e.target.name });
    }
      
    const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setCard({ ...card, [name]: value });
    }

    const publishableKey:any = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const stripePromise = loadStripe(publishableKey);
    
    const createCheckOutSession = async () => {
        const stripe:any = await stripePromise;
        const checkoutSession = await axios.post('/api/create-stripe-session', {
        item: {
            name: `${data_camarote?.nome}`,
            description: `${data_camarote?.nome} | Rap É Poesia | 25/03 - Rio de Janeiro/RJ`,
            image: 'https://images.sympla.com.br/6229a099608e1-lg.jpg',
            quantity: 1,
            price: data_camarote?.valor+(data_camarote?.valor/100)*4,
        },
        });
        const result = await stripe.redirectToCheckout({
            sessionId: checkoutSession.data.id,
        });
        if (result.error) {
            alert(result.error.message);
        }
    };

    const [showCancel, setShowCancel] = useState(false)
    const [showSuccess, setShowSucess] = useState(false)

    useEffect(()=>{
      if (typeof window !== "undefined") {
        const callback_stripe = window.location.search
        if(callback_stripe.includes("?status=cancel")){
            setShowCancel(true)
        }else if(callback_stripe.includes("?status=success_stripe")){
            setShowSucess(true)
            // SEND EMAIL
            //sendEmail(reserva?.nome, reserva?.email, `Confirmação de Reserva`)
            confirmReservaApi()
        }
      }
    }, [])

    const sendConfirmEmail = () => {
        const data_cached:any = JSON.parse(window.localStorage.getItem('rapepoesia_rsv')!)
        sendEmail(data_cached?.name, data_cached?.email, data_cached?.cpf, data_camarote?.id)
    }

    const sendEmail = (name:string='', email:string='', cpf:string='', qtd_pessoas:number=0, camarote_id:number=0) => {
        fetch(`api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                camarote_id,
                qtd_pessoas,
                cpf
            })
        }).then((response)=>{
            console.log('emaillll', response)
            toast.success("Email de confirmação enviado com sucesso!", { theme: 'colored' });            
        })
    }

    useEffect(()=>{
        if(step===2){
            //

        }else if(step===4){
            // GERA E TENTA FAZER A COBRAÇA
            createCheckOutSession();
        }
    },[ step ])

    const [reserva, setReserva] = useState<any>({
        nome: '',
        email: '',
        cpf: '',
        dt_nasc: ''
    })
      
    const handleInputChangeReserva = (e:any) => {
        const { name, value } = e.target;
        setReserva({ ...reserva, [name]: value });
    }

    const savePreReserva = () => {
        if(reserva?.nome !== '' || reserva?.cpf !== '' || reserva?.email !== '' || reserva?.dt_nasc !== ''){
            window.localStorage.setItem('rapepoesia_rsv', JSON.stringify(reserva))
            setStep(4)
        }else{
            toast.error("Atenção: Preencha todos os campos corretamente!", { theme: 'colored' });
            //alert('Não deixe campos em branco!')
        }
    }

    const confirmReservaApi = async() => {
        const data_cached:any = JSON.parse(window.localStorage.getItem('rapepoesia_rsv')!)
        if(data_cached){
            const res = await fetch(`${URL_API}/update_reserva`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data_cached,
                    camarote_id: data_camarote?.id,
                })
            })
            const retorno = await res.json()
            //console.log("updatereserva", retorno)
            if(retorno.status){
                window.localStorage.removeItem("rapepoesia_rsv")
                //window.location.reload()
            }
        }
    }

    return (<>
        {props.camarote && <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop={`${step>=4?`none`:`none`}`}
        >
            <ToastContainer position="bottom-center" />
            <Modal.Body id="modal_camarote" className="m-0 p-0">
                <Row>
                    <Col md={6} className="m-0 p-0" style={{ background: `url(https://radiofreshwest.com.br/rapepoesia/camarotes/${data_camarote?.id}.jpg)`, backgroundSize: 'cover', minHeight: '300px' }}>
&nbsp;                    </Col>
                    <Col md={6} className="py-5 px-4 d-flex align-item-center justify-content-center">
                        <Row>
                            {step < 4 || data_camarote?.reservado === 1 && <Col md={12} className="pb-3">
                                <Badge onClick={()=>setStep(1)} bg={`${step===1?`warning`:`dark`}`} pill className={`mx-2 ${step!==1&&`opacity-25`}}`}>1</Badge>
                                <Badge bg={`${step===2?`warning`:`dark`}`} pill className={`mx-2 ${step<2&&`opacity-25`}}`}>2</Badge>
                                <Badge bg={`${step===3?`warning`:`dark`}`} pill className={`mx-2 ${step<3&&`opacity-25`}}`}>3</Badge>
                            </Col>}
                            {step === 1 && <><Row className="px-4"><Col md={12}>
                                    {showCancel && <Alert className="text-center m-0 mb-3 py-2" variant="danger">Reserva cancelada</Alert>}
                                    {showSuccess && <Alert className="text-center m-0 mb-3 py-2" variant="success">Reserva aprovada</Alert>}
                                    <h3 className="m-0 p-0 mb-2">{data_camarote?.nome}</h3>
                                    <p className="m-0 p-0 mb-2">🧑‍🤝‍🧑 <small className="text-muted">Lotação</small><br/>{data_camarote?.qtd_pessoas} Pessoas</p>
                                    <p className="m-0 p-0 mb-2">🥂 <small className="text-muted">Consumação</small><br/>{data_camarote?.consumacao.toLocaleString('pt-br', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' })}</p>
                                    <p className="m-0 p-0 mb-2">💰 <small className="text-muted">Valor de Reserva</small><br/>
                                        <span className="mb-0 pb-0" style={{ fontSize: '1.5em' }}>{data_camarote?.valor.toLocaleString('pt-br', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' })}</span>
                                        <small className="text-muted d-block m-0 p-0">(+{((data_camarote?.valor/100)*4).toLocaleString('pt-br', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' })} de taxa)</small>
                                    </p>
                                </Col>
                                <Col md={12} className="pt-4">
                                    <Button disabled={data_camarote?.reservado || showSuccess} onClick={()=> setStep(2)} variant={`${!data_camarote?.reservado ? `outline-success` : `outline-danger`}`} >
                                        {data_camarote?.reservado===0 && !showSuccess && <>✔️ Reservar Camarote</>}
                                        {data_camarote?.reservado===1 && !showSuccess && <>🚫 Camarote Reservado</>}
                                        {showSuccess && <>✔️ Camarote Reservado</>}
                                    </Button>
                                </Col>
                            </Row></>}
                            {step===2 && <><Row className="px-4"><Col md={12}>
                                    <h1>Reserva Online</h1>
                                </Col>
                                <Col md={12} className="pt-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Nome Completo"
                                        onChange={handleInputChangeReserva}
                                        className="form-control"
                                    />
                                    <InputMask mask={"999.999.999-99"} pattern="[0-9]*" className="form-control mt-3" type="text" onChange={handleInputChangeReserva} name={'cpf'} placeholder="CPF" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="E-mail"
                                        onChange={handleInputChangeReserva}
                                        className="form-control mt-3"
                                    />
                                    <InputMask mask={"99/99/9999"} pattern="[0-9]*" className="form-control mt-3" type="text" onChange={handleInputChangeReserva} name={'dt_nasc'} placeholder="Data de Nascimento" />
                                </Col>
                                <Col md={12} className="pt-4">
                                    <Button onClick={()=> savePreReserva() } variant="outline-success">✔️ Continuar</Button>
                                    <Button onClick={()=> setStep(1)} size="sm" variant="outline-dark" style={{ float: 'right' }}>voltar</Button>
                                </Col>
                            </Row></>}
                            {step===3 && <><Row className="px-3"><Col md={12}>
                                    <h1>Pagamento Online</h1>
                                </Col>
                                <Col md={6} className="m-0 p-2">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Nome no Cartão"
                                        maxLength={25}
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        className="form-control mb-2"
                                    />
                                    <input
                                        type="text"
                                        name="expiry"
                                        maxLength={5}
                                        placeholder="Validade"
                                        pattern="\d\d/\d\d"
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        className="form-control"
                                    />
                                </Col>
                                <Col md={6} className="m-0 p-2">
                                    <input
                                        type="tel"
                                        name="number"
                                        placeholder="Número do Cartão"
                                        maxLength={16}
                                        pattern="[\d| ]{16,22}"
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        className="form-control mb-2"
                                    />
                                    <input
                                        type="text"
                                        name="cvc"
                                        placeholder="CVV"
                                        maxLength={3}
                                        pattern="\d{3,4}"
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        className="form-control"
                                    />
                                </Col>
                                <Col md={12} className="pt-2">
                                    <Button onClick={()=> setStep(4)} variant="outline-success">💳 Pagar e Reservar</Button>
                                </Col>
                            </Row></>}
                            {step===4 && <><Row className="px-3 text-center">
                                <Col md={12}>
                                    <div className="container_loader">
                                        <div className="dash uno"></div>
                                        <div className="dash dos"></div>
                                        <div className="dash tres"></div>
                                        <div className="dash cuatro"></div>
                                    </div>
                                    <p style={{ letterSpacing: '-1px', lineHeight: '25px', fontSize: '1.5em' }} className="m-0 p-0">Processando Pagamento<br/>para Reservar o Camarote...</p>
                                </Col>
                            </Row></>}
                        </Row>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>}
    </>)
}

export default ModalCartCamarote