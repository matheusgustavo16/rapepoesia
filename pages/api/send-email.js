const nodemailer = require("nodemailer")

export default function sendEmail (req, res) {
    let transporter = nodemailer.createTransport({
        host: 'web.hahost.com.br',
        port: 465,
        auth: {
            user: 'noreply@rapepoesia.com.br',
            pass: '-Fh8gq}DnOFP'
        }
    })
    transporter.sendMail({
        from: `"Rap É Poesia <noreply@rapepoesia.com.br>"`,
        to: req.body.email,
        replyTo: `dougpicaxvi@gmail.com`,
        subject: `Reserva de Camarote - Rap É Poesia`,
        text: `Reserva de Camarote - Rap É Poesia`,
        html: `<div style="display: block; padding: 0 2% 2% 2%; width:96%; font-family: Ubuntu, Trebuchet MS, Tahoma, Arial, sans-serif;">
        <div style="display: block; width:100%; max-width: 600px; margin:0 auto; border-radius: 0 0 15px 15px; overflow:hidden;">
            <div style="width:100%; display:block;"><img src="https://i.imgur.com/5ptdU5U.jpg" style="max-width:100%;"></div><!-- cabecalho -->
            <div style="width: 84%; display:block; background:#f6f6f6; padding: 10% 8%; min-height: 100px; color:#777; font-size:15px; font-weight:normal; line-height:24px;">
                <h1 style="font-size:18px; font-weight:600; color:#404040; line-height:24px; margin:0 0 15px 0">🥂 Salve ${req.body.name && req.body.name.split(' ')[0]}!</h1>
                <p style="line-height:24px;">Esse é o email de confirmação da sua reserva do <strong>Camarote ${req.body.camarote_id}</strong>.<br/>
                Apresente esse print com os dados da reserva caso for solicitado, Aproveite o role e Se Beber, Não Dirija!<br/><br/>
                <strong>Número do camarote:</strong> ${req.body.camarote_id}<br/>
                <strong>Quantidade de pessoas:</strong> ${req.body.qtd_pessoas}<br/>
                <strong>Nome completo:</strong> ${req.body.name}<br/>
                <strong>CPF:</strong> ${req.body.cpf}<br/>
                <strong>E-mail:</strong> ${req.body.email}<br/>
                <strong>Forma de pagamento:</strong> Cartão de Crédito <small>(stripe online)</small></p>
            </div><!-- corpo da mensagem -->
        </div><!-- box branco central -->
        <div style="width:100%; text-align:center; font-size:13px; color:#888; margin-top:35px; margin-bottom: 25px;">
            Rap é Poesia | Poesia Acústica convida Teto & TZ da Coronel<br>
            Boulevard 28 de Setembro, 382, Vila Isabel<br>Rio de Janeiro, RJ
            </div>
        </div><!--geral-->`
    }).then((response) => { res.send(response) })
        .catch((error) => { res.send(error) })
}