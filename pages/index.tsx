import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useRef, useState } from 'react';
//import Image from 'next/image'
import { Container, Row, Col, Image, Button } from 'react-bootstrap'
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import ReactPlayer from 'react-player';
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const URL_API = 'https://api.rapepoesia.com.br'

const photos = [
  {
    src: "./images/eventos/IMG_2491.jpg",
    width: 4,
    height: 3,
    title: `Baile da Pesada com Djonga`
  },
  {
    src: "./images/eventos/_PRT4926.jpg",
    width: 2,
    height: 1,
    title: `Baile da Pesada com Djonga`
  },
  {
    src: "./images/eventos/IMG_1260.jpg",
    width: 3,
    height: 4,
    title: `Baile da Pesada com Djonga`
  },
  {
    src: "./images/eventos/IMG_1837.jpg",
    width: 3,
    height: 4,
    title: `Baile da Pesada com Djonga`
  },
  {
    src: "./images/eventos/_PRT5084.jpg",
    width: 4,
    height: 3,
    title: `Baile da Pesada com Djonga`
  },
  {
    src: "./images/eventos/IMG_2532.jpg",
    width: 4,
    height: 3,
    title: `Baile da Pesada com Djonga`
  }
];

import '../styles/Home.module.css'
import ModalCartCamarote from '../modalCart';

const Home: NextPage = (props:any) => {

  const [showModal, setShowModal] = useState(false)
  const camarotesRef:any = useRef()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false, speed: 5 }, [Autoplay()])
  const camarotes = props?.camarotes

  const videoRef:any = useRef()
  const [offsetTop, setOffsetTop] = useState(0)

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const [camaroteSelect, setCamaroteSelect] = useState<any>(null)

  const [lineup, setLineup] = useState([
    'Poesia Acústica',
    'Teto',
    'TZ da Coronel'
  ])

  const handleScroll = () => {
    const position = window.pageYOffset
    setOffsetTop(position)
  }

  useEffect(() => {
    console.log('propsss', props)
    // SCROLL FUNCT
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  },[])

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  // MODAL FORM CAMAROTE

  useEffect(()=>{
    if (typeof window !== "undefined") {
      const callback_stripe = window.location.search
      const index = callback_stripe.split('=')[2]
      const filtered = camarotes.filter((x:any)=>x?.nome.split(' ')[1]===index)[0]
      if(callback_stripe.includes("?status=cancel") || callback_stripe.includes("?status=success_stripe")){
        setShowModal(true)
        setCamaroteSelect(filtered)
      }
    }
  }, [])

  const reloadPage = () => {
    if(window.location.search){
      window.location.href = `${window.location.origin}`
    }
  }


  return (
    <>
      <Head>
        <title>Rap É Poesia | 25/03 - Rio de Janeiro/RJ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Rap é Poesia! Depois da existência do maior projeto musical nacional, Poesia Acústica, o evento Rap é poesia nasce das mesmas entranhas e tem o objetivo de trazer muito entretenimento para todos vocês. Nosso pontapé inicial é na Quadra da Vila Isabel acompanhado de grandes nomes da nova geração da cena. Vai ficar fora dessa?" />
        <link rel="icon" href="/rapepoesia.ico" />
      </Head>
      <Container id="header" className="text-center text-light d-flex align-item-center justify-content-center" fluid>
        <Container>
          <Row className="py-4 h-100 pb-5">
            <Col md={12} className="p-0 m-0 mb-5">
              <Image src="/images/rapepoesia.png" className="img-fluid" width={191} height={164} />
            </Col>
            <Col md={12} className="p-0 m-0">
              <h3>Dia 25 de Março</h3>
            </Col>
            <Col md={12} className="slide_lineup p-0 m-0">
              <div className="embla mb-2" ref={emblaRef}>
                <div className="embla__container">
                  {lineup.map((artist:any, key)=> <div className="embla__slide" style={{ fontSize: '6em' }}>{artist}</div>)}
                </div>
              </div>
            </Col>            
            <Col md={12} className="p-0 m-0 mb-3">
              <Button onClick={()=> window.open('https://www.sympla.com.br/rap-e-poesia--poesia-acustica-convida-teto--tz-da-coronel__1510956', '_blank')} variant="outline-warning" style={{ marginRight: '.5em' }}>Comprar Ingresso</Button>
              <Button onClick={()=> camarotesRef.current.scrollIntoView()} variant="outline-warning">Reservar Camarote</Button>
            </Col>
            <Col md={12} className="p-0 m-0">
              <h3>Na Quadra da Vila Isabel</h3>
            </Col>
            <Col md={12} className="p-0 m-0">
              <Image src="/images/fresh-pinneapple.png" className="img-fluid" width={170} />
            </Col>
            <Col md={12} className="p-0 m-0 mt-4">
              <Image src="/images/icon_mouse.png" className="img-fluid mouse_scroll_down" width={25} />
            </Col>
          </Row>
        </Container>
      </Container>
      <Container id="sobre" className="bg_white section text-center py-5" fluid>
        <Container className="my-lg-5 px-lg-5">
          <Row>
            <Col className="px-lg-5">
              <h2>Sobre Nós</h2>
              <p>Rap é Poesia, é a mais nova label carioca que veio trazer boas experiências para quem gosta de eventos. O projeto nasce como uma festa itinerante, que traz o melhor do hip-hop e da experiência de estar em um evento de qualidade para todos os cantos do Brasil.  Nosso artista residente é nada mais nada menos do que o maior projeto musical do Brasil, Poesia Acústica, que em todas as edições convidará artistas diferentes para preencher o line-up e dividir o palco principal.</p>
              <p>Criada no Rio de Janeiro, pelos mesmos criadores do projeto Poesia acústica, Rap é Poesia, vem para unir os ritmos e as tribos. Nenhum tipo de distinção e de preconceito é aceito na nossa festa!</p>
              <p>A quadra da Vila Isabel é o local onde escolhemos nossa primeira edição, banheiros bem feitos e distribuídos, grande área no salão, mais de 30 camarotes e grandes áreas de BAR farão com que sua experiencia se torne mais confortável.</p>
              <p>A produção do evento, fica com a Fresh Mind Co., empresa com grande prestígio no mercado e presente nos melhores eventos do segmento no RJ.</p>
              <p>RAP É POESIA!</p>
            </Col>
          </Row>
        </Container>
      </Container>
      <Container id="eventos" className="bg_dark section text-light text-center py-5" fluid>
        <Container>
          <Row>
            <Col className="px-lg-5 pt-5">
              <h2>Eventos</h2>
            </Col>
            <Col md={12} className="px-lg-5 pb-5">
              <Gallery photos={photos} onClick={openLightbox} />
            </Col>
          </Row>
        </Container>
      </Container>
      <Container id="poesia-acustica" className="bg_white section text-center py-5" fluid>
        <Container>
          <Row className="px-lg-5 pt-5">
            <Col md={12} className="px-lg-5">
              <Image src="/images/pineapple-big.png" className="img-fluid d-inline-block pineapple" />
            </Col>
            <Col md={12} className="px-lg-5">
              <Image src="/images/poesia-acustica.png" className="img-fluid d-inline-block poesia" />
            </Col>
            <Col md={12} className="px-lg-5 mt-4">
              <p>O Poesia Acústica é um projeto, do Canal Pineapple Storm TV no Youtube, que reúne artistas do Rap nacional, com outros artistas de estilos variados do cenário musical brasileiro, para comporem juntos. O projeto, já lançou 13 faixas, e é reconhecido como um dos maiores sucessos musicais da internet Brasileira, somando mais de 2 bilhões de visualizações no Youtube!</p>
              <p>O sucesso do projeto tem sido tão grande, que desde 2016, o Poesia Acústica, expandiu seu território além da internet, levando já mais de 200 shows lotados, para mais de 50 cidades do Brasil. Com um line-up variável, garante, em cada um de seus shows, uma experiência única e diferenciada.</p>
            </Col>
          </Row>
          <Row className="mt-5 px-lg-5 pb-5 text-center">
            <Col>
              <div className="d-block video-embed" style={{ margin: '0 auto' }}><ReactPlayer style={{ display: 'block' }} url="http://51.222.240.217/~radiowes/rapepoesia/divulgacao-poesia-acustica.mp4" width={530} height={300} volume={volume} controls playing={isPlaying}
                onPlay={()=> setVolume(.5)}
                config={ { file: { attributes: { controlsList: "nodownload" } } } }
              /></div>
            </Col>
          </Row>
        </Container>
      </Container>
      <Container id="teto" className="bg_white section py-5" fluid>
        <Container className="px-lg-5 pt-sm-5 mt-sm-5">
          <Row className="px-lg-5 pt-sm-5 mt-sm-5">
            <Col md={12} className="px-lg-5 mt-4">
              <div id="teto_mask" style={{ width: '330px', minHeight:'900px', float: 'right' }}>&nbsp;</div>
              <h1>Teto</h1>
              <p>Teto, é um rapper, cantor e compositor brasileiro, que ficou conhecido através de prévias de suas músicas, que foram lançadas não oficialmente em vários canais, alcançando milhões de visualizações e ganhando fama em redes sociais como o TikTok e Instagram.</p>
              <p>Começou sua carreira musical em 2018, lançando algumas músicas (sendo elas "Fico Famoso" e "Say Yes") que acabaram não rendendo sucesso, sendo mais tarde retiradas das plataformas digitais. No final de 2019, a gravadora Hash Produções se interessou e fechou uma parceria de investimento com o músico. Teto conseguiu construir uma base de fãs após fazer participações nos hits "Drip da Roça" de Reid e "Saturno" de "Burn-O" em 2020. No mesmo ano, ele começou a fazer lives no seu Instagram para divulgar suas músicas, que ainda estavam em fase de produção. Pessoas que gostaram de seu trabalho começaram a lançar não oficialmente suas músicas, que ficaram conhecidas como prévias, no YouTube. Os vídeos de suas músicas alcançaram milhões de visualizações em vários canais.</p>
              <p>Sua repercussão atraiu o rapper Matuê, que se aproximou de Teto com o interesse de fazer um feat e mais tarde o convidou para fazer parte da sua gravadora 30PRAUM. Como ainda estava em pré-contrato com a gravadora Hash, ele decidiu não levar o contrato adiante e assinou com a 30PRAUM em janeiro de 2021, dando início definitivo na sua carreira.</p>
              <p>Mesmo em pouco tempo, Teto já tem vários reconhecimentos. Ele se tornou um dos maiores artistas de sucesso do Brasil no momento apenas lançando prévias de suas músicas e também se tornando uma das revelações do Trap no ano de 2020.</p>
            </Col>
            <Col md={12} className="px-lg-5">
              <div className="video-embed-teto" style={{ float: 'left' }}><ReactPlayer url="https://www.youtube.com/watch?v=cMTrUCasbss" width={650} volume={0} controls playing={false}
                config={ { file: { attributes: { controlsList: "nodownload" } } } }
              /></div>
            </Col>
          </Row>
        </Container>
      </Container>
      <Container id="tz" className="bg_white section py-5" style={{ textAlign: 'right' }} fluid>
        <Container className="py-5">
          <Row className="px-lg-5">
            <Col md={12} className="px-lg-5 mt-4">
              <div id="tz_mask" style={{ width: '210px', minHeight:'500px', float: 'left' }}>&nbsp;</div>
              <h1>Tz Da Coronel</h1>
              <p>Unindo funk e trap, enquanto apresenta elementos clássicos dos gêneros em terras cariocas, TZ da Coronel fez seu nome na cena no início do ano de 2021, estourando os sons “Anota a Placa” e “Trajado de Glock”.</p>
              <p>Com apenas 19 anos de idade, TZ da Coronel iniciou sua caminhada na música através das batalhas de rima em 2017, atualmente o artista é conhecido pelos sons que tem na pista e pelo jeito característico do carioca de fazer música. Mas de onde vem suas influências? Elas vão de funk a trap gringo.</p>
              <p>Na vertente do trap, o primeiro sucesso de TZ da Coronel, “Anota Placa”, rodou as ruas por ter uma pegada tranquila. Além de ter uma letra que exalta a fé nas crianças e o progresso dos moradores de comunidade. Mostrando um outro lado, TZ da Coronel logo emplacou “Trajado de Glock”, um verdadeiro hit maker, suas músicas hoje em dia somam mais de 100 milhões de plays nas plataformas digitais.</p>
            </Col>
            <Col md={12} className="px-lg-5">
              <div className="video-embed-tz" style={{ float: 'right' }}><ReactPlayer url="https://www.youtube.com/watch?v=akuUn1MzVxc" width={650} volume={0} controls playing={false}
                config={ { file: { attributes: { controlsList: "nodownload" } } } }
              /></div>
            </Col>
          </Row>
        </Container>
      </Container>
      <Container id="camarotes" ref={camarotesRef} className="bg_dark section text-light text-center py-5" fluid>
        <Container>
          <Row>
            <Col className="px-lg-5 pt-5">
              <h2 className="m-0 p-0">Camarotes</h2>
              <p className="m-0 p-0">Reserve já o seu camarote!</p>
            </Col>
            <Col md={12} className="px-lg-5 pb-5 pt-4">
              <div id="mapa">
                <ul>
                  {camarotes.map(function (x:any, i:any) {
                    //console.log("cacamamarorotee", x, i)
                    const posicao = parseInt(x?.nome.split(' ')[1]);
                    return <li onClick={()=>{
                      setCamaroteSelect(x);
                      setShowModal(true);
                    }} className={`camarote_${posicao} ${(x?.reservado) ? ` reservado` : x?.reservado}`} key={i}>{posicao}</li>;
                  })}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
      <Container id="footer" className="section text-center pt-5 pb-0 mb-0" fluid>
        <Container>
          <Row>
            <Col md={12} className="pt-4 mb-0 pb-0">
              <p style={{ letterSpacing: '-2px', lineHeight: '20px' }}>Todos os Direitos Reservados<br/>
              Desenvolvido com ❤️ por West Side Co.</p>
            </Col>
          </Row>
        </Container>
      </Container>
      {showModal && <ModalCartCamarote camarote={camaroteSelect} show={showModal} onHide={() =>{ setShowModal(false); setCamaroteSelect(null); reloadPage(); }} />}
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={photos.map((x:any) => ({
                ...x,
                srcset: x?.src,
                caption: x?.title
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </>
  )
}

export default Home

export const getStaticProps = async () => {
  const camarotes = await fetch(`${URL_API}/get_camarotes`, {
    method: 'GET'
  })
  const json = await camarotes.json()
  // console.log('camarotessApi', json)
  return {
      props: {
        camarotes: json.camarotes ? json.camarotes : [{}]
      },
      revalidate: 120
  }

}