import dotenv from 'dotenv';
dotenv.config();

import twilio from 'twilio';
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const service = client.verify.services(process.env.TWILIO_SERVICE_SID);

import sendgrid from '@sendgrid/mail';
const mail = sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

import QRCode from 'qrcode-svg';

import validator from 'validator';
const { isUUID, isEmail, isMobilePhone } = validator;


function Auth({email, phone, id}) {
  try {
    if (!new.target) return new Auth(id);

    if (id === null || typeof id !== 'string' || isUUID(id) === false) throw new Error('Invalid ID');
    if (email === null || typeof email !== 'string' || isEmail(email) === false) throw new Error('Invalid Email');
    if (phone === null || typeof phone !== 'string' || isMobilePhone(phone, 'any', {strictMode: 'true'}) === false) throw new Error('Invalid Phone');

    const identity = Object.create(null, {
      create: {
        value: async function createNewEntity() {
          try {
            const identity = await service.entities.create({ identity: id });
            if (identity.sid) return identity;
            else throw new Error('Failed to create new entity');
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true,
      },
      get: {
        value: async function getEntity() {
          try {
            const identity = await service.entities(id).fetch();
            if (identity.sid) return identity;
            else return null;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true,
      },
      list: {
        value: async function listEntities(limit = 0) {
          try {
            const identities = await service.entities.list({ limit: limit });
            if (identities.length) return identities;
            else return null;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true,

      },
      delete: {
        value: async function removeEntity() {
          try {
            const response = await service.entities(id).remove();
            return response;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      }
    });

    return Object.defineProperties(this, {
      create: {
        value: async () => {
          try {
            const factor = await service.entities(id).newFactors.create({
              factorType: 'totp',
              friendlyName: 'user accounts',
              'config.appId': 'com.colliverde.app',
              'config.timeStep': 60,
              'config.codeLength': 7,
              'config.alg': 'sha256'
            });

            if (factor.sid)  {
              Object.defineProperty(this, 'sid', {value: factor.sid});
              const secrets = {
                key: factor.binding.secret,
                qr: factor.binding.uri,
              };
              const response = await sendQRCode(email, secrets);
              return response;
            }
            else throw new Error('failed to create new authentication factor.');

          } catch (error) {
            throw error;
          }
        },
        enumerable: true,
      },
      get: {
        value: async function getFactor(sid) {
          try {
            if (!sid) throw new Error('Invalid factor sid');
            const factor = await service.entities(id).factors(sid).fetch();
            if (factor.sid) {
              Object.defineProperty(this, 'sid', {value: factor.sid});
              return factor.status;
            }
            else return null;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true,
      },
      list: {
        value: async function listFactors(limit = 50) {
          try {
            const factors = await service.entities(id).factors.list({ limit: limit });
            if (factors.length) return factors;
            else return null;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true,
      },
      verify: {
        value: async function verifyFactor(code) {
          try {
            if (!this.sid) throw new Error('factor sid not yet set.');
            if (!code) throw new Error('Invalid code');

            const response = await service.entities(id).factors(sid).update({ authPayload: code });
            return response;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true,
      },
      delete: {
        value: async function deleteFactor() {
          try {
            if (!this.sid) throw new Error('factor sid not yet set.');

            const response = await service.entities(id).factors(sid).remove();
            return response;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true,
      },
      close: {
        value: async function deleteEntity() {
          try {

            const response = await service.entities(id).remove();
            return response;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true,
      },
      authenticate: {
        value: async function challengeFactor(code, details = null) {
          try {
            if (!this.sid) throw new Error('factor sid not yet set.');

            const options = {
              authPayload: code,
              factorSid: this.sid,
            };
            if (details) options.hiddenDetails = {details};

            const response = await service.entities(id).challenges.create({options});
            return response;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true,
      }
    });

    const sendGridMail = Object.create(null, {
      sendQRCode: {
        value: async function sendQRCode(email, secrets) {
          try {
            const {uri, key} = secrets;
            const qr = new QRCode({
              content: uri,
              width: 211,
              height: 211,
              background: 'transparent',
              padding: 5,
              margin: 0,
              join: true,
              xmlDeclaration: false,
              container: 'svg-viewbox',

            });
            const svg = qr.svg();

            const emailTemplate = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

  body {
    --default-height: 360px;
    --default-width: 280px;

    --credentials-width: 210px;
    --credentials-height: 210px;

    --gray-background: rgba(55, 55, 55, 0.65);
    --black-background: rgba(0, 0, 0, 0.25);

    position: relative;



    display: flex;
    flex-direction: column;
    align-items: center !important;
    justify-content: center !important;

    margin: 0;
    padding: 0;

    width: 100%;
    height: min-content;

    font-family: "Roboto", arial, helvetica, sans-serif;

    box-sizing: border-box;



  }

  div#wrapper {

    height: 100%;
    width: var(--default-width);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 25px;



  }

  main#siff {
    height: var(--default-height);
    width: var(--default-width);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


    box-sizing: border-box;

  }

  main#siff>section {
    height: var(--default-height);
    width: var(--default-width);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin: 0;
    padding: 0;

    border-radius: 25px;

    box-sizing: border-box;
    box-shadow: inset 0 0 6px 3px var(--black-background);

    background-image: url("http://x4.ngrok.io/bg/sendgrid.jpg");
    background-size: cover;
    background-position: center center;
  }

  main#siff>section>div#credentials {
    position: relative;

    width: var(--credentials-width);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;

    margin: 0;
    padding: 0;

  }

  main#siff>section>div#credentials>div#svg {
    position: relative;

    height: 210px;
    width: 210px;

    text-align: center;

    margin: 0;
    padding: 0;

    opacity: 0.8;
    box-sizing: border-box;

    outline: 1px solid white;
    background-color: rgba(255, 255, 255, 0.6);

    z-index: 100;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    box-sizing: border-box;
  }

  main#siff>section>div#credentials>div#svg>svg {

    width: 100% !important;
    height: 100% !important;

    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }


  main#siff>section>div#credentials>p#key {




    text-align: center;

    width: 100%;

    font-size: 9px;
    font-weight: 400;
    padding: 10px;

    outline: 1px solid white;


    background-color: var(--black-background);

    color: white;

    user-select: all;
    -webkit-user-select: all;
    -moz-user-select: all;

    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
  }

  footer {
    width: var(--default-width);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


    box-sizing: border-box;
  }

  footer>section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: 15px;

    width: 75%;
    padding: 10px;

    border-top: 1px solid black;
  }

  footer>section>small {

    width: 100%;

    font-size: 9px;
    font-weight: 400;

    letter-spacing: 0.5px;
    line-height: 11px;

    text-align: justify;
  }

  footer>section>small.author {

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;

    font-size: 9px;
    font-weight: 300;
    line-height: 10px;

    margin: 0;
    padding: 0;


  }

  footer>section>small.author>a {
    text-decoration: none;
    color: gray;

    padding: 0;
    margin: 0;

    text-align: center;
  }


  .highlight {
    padding: 1px 2px;
    background-color: rgba(255, 238, 0, 0.85);
    color: black;
  }

  .warning {
    padding: 1px 2px;
    background-color: rgba(255, 48, 48, 0.85);
    color: white;
  }
</style>
<div id="wrapper">
  <main id="siff">
    <section>
      <div id="credentials">
        <div id="svg">${svg}</div>
        <p id="key">${key}</p>
      </div>
    </section>
  </main>
  <footer>
    <section>
      <small>This message was sent upon the request for a QR installation code. You need to install an authenticator to
        install the code. To install the QR code, use the authenticator app of your choice to scan the QR code.
        Alternatively, you can install it manually by entering the "Key" into the authenticator. The QR code is only
        valid temporarily and will expire if not used. For security concerns, never share your QR code with
        anyone.<br></small>
      <small class="author"><a href="https://www.colliverde.com/">Colliverde. 2021.</a></small>
    </section>
  </footer>
</div>`;

            const message = {
              to: email,
              from: 'yousif@almudhaf.com',
              subject: 'The Authenticator Code',
              content: [
                {
                  type: 'text/html',
                  value: emailTemplate
                }
              ],
              // template_id: process.env.SENDGRID_TEMPLATE_ID,
              personalizations: [
                {
                  to: [
                    {
                      email
                    }
                  ],
                  // dynamic_template_data: {
                  //   svg: qr.svg(),
                  //   key: key
                  // }
                }
              ],
            };

            const response = await mail.send(message);
            console.log(response);
            return response;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      }
    });

    return authenticator;

    return Object.defineProperties(this, {
      identity: {
        value: identity,
        enumerable: true
      },
      authenticator: {
        value: authenticator,
        enumerable: true
      },
      mail: {
        value: sendGridMail ,
        enumerable: true
      },
    });
  }
  catch (error) {
    throw error;
  }
}

const authy = new Auth({id: '2cd65173-6260-44d0-ace4-0d28e85672ff', email: 'yousif@almudhaf.com', phone: '+96555968743'});

// const factor = await authy.authenticator.create();
// console.log(factor);

// const verified = await authy.authenticator.verify('YF0261a4157f2e4ef7c4f180052d1d71ce', '4786116');
// console.log(verified);

// const factors = await authy.authenticator.delete('YF0261a3f9b9320bed780def05c710c3c3');
// console.log(factors);

// const factors = await authy.list(50);
// console.log(factors);
// factors.forEach(async (factor) => {
//   const response = await authy.delete(factor.sid);
//   console.log(response);
// });

// const response = await authy.mail.sendQRCode('yousif@almudhaf.com', { key: 'ODJVBA5NPHORGSPTRFDTX46V5VMT3KXL', uri: 'otpauth://totp/Colliverde:Colliverde?secret=ODJVBA5NPHORGSPTRFDTX46V5VMT3KXL&issuer=Colliverde&algorithm=SHA256&digits=7&period=60'});
// console.log(response);

export default Auth;

// const entities = await service.entities.list();
// console.log(entities);

// const entity = await service.entities('2cd65173-6260-44d0-ace4-0d28e85672ff').remove();
// console.log(entity);

// const list = await service.fetch();
// console.log(list);

// const response = await service.update({
//   totp: {issuer: 'www.colliverde.com'}
// });
// console.log(response);




async function sendQRCode(email, secrets) {
  try {
    const { uri, key } = secrets;
    const qr = new QRCode({
      content: uri,
      width: 211,
      height: 211,
      background: 'transparent',
      padding: 5,
      margin: 0,
      join: true,
      xmlDeclaration: false,
      container: 'svg-viewbox',

    });
    const svg = qr.svg();

    const emailTemplate = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

  body {
    --default-height: 360px;
    --default-width: 280px;

    --credentials-width: 210px;
    --credentials-height: 210px;

    --gray-background: rgba(55, 55, 55, 0.65);
    --black-background: rgba(0, 0, 0, 0.25);

    position: relative;



    display: flex;
    flex-direction: column;
    align-items: center !important;
    justify-content: center !important;

    margin: 0;
    padding: 0;

    width: 100%;
    height: min-content;

    font-family: "Roboto", arial, helvetica, sans-serif;

    box-sizing: border-box;



  }

  div#wrapper {

    height: 100%;
    width: var(--default-width);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 25px;



  }

  main#siff {
    height: var(--default-height);
    width: var(--default-width);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


    box-sizing: border-box;

  }

  main#siff>section {
    height: var(--default-height);
    width: var(--default-width);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin: 0;
    padding: 0;

    border-radius: 25px;

    box-sizing: border-box;
    box-shadow: inset 0 0 6px 3px var(--black-background);

    background-image: url("http://x4.ngrok.io/bg/sendgrid.jpg");
    background-size: cover;
    background-position: center center;
  }

  main#siff>section>div#credentials {
    position: relative;

    width: var(--credentials-width);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;

    margin: 0;
    padding: 0;

  }

  main#siff>section>div#credentials>div#svg {
    position: relative;

    height: 210px;
    width: 210px;

    text-align: center;

    margin: 0;
    padding: 0;

    opacity: 1;
    box-sizing: border-box;

    outline: 1px solid white;
    background-color: rgba(255, 255, 255, 0.6);

    z-index: 100;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    box-sizing: border-box;
  }

  main#siff>section>div#credentials>div#svg>svg {

    opacity: 0.8;

    width: 100% !important;
    height: 100% !important;

    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }


  main#siff>section>div#credentials>p#key {




    text-align: center;

    width: 100%;

    font-size: 9px;
    font-weight: 400;
    padding: 10px;

    outline: 1px solid white;


    background-color: var(--black-background);

    color: white;

    user-select: all;
    -webkit-user-select: all;
    -moz-user-select: all;

    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
  }

  footer {
    width: var(--default-width);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


    box-sizing: border-box;
  }

  footer>section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: 15px;

    width: 75%;
    padding: 10px;

    border-top: 1px solid black;
  }

  footer>section>small {

    width: 100%;

    font-size: 9px;
    font-weight: 400;

    letter-spacing: 0.5px;
    line-height: 11px;

    text-align: justify;
  }

  footer>section>small.author {

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;

    font-size: 9px;
    font-weight: 300;
    line-height: 10px;

    margin: 0;
    padding: 0;


  }

  footer>section>small.author>a {
    text-decoration: none;
    color: gray;

    padding: 0;
    margin: 0;

    text-align: center;
  }


  .highlight {
    padding: 1px 2px;
    background-color: rgba(255, 238, 0, 0.85);
    color: black;
  }

  .warning {
    padding: 1px 2px;
    background-color: rgba(255, 48, 48, 0.85);
    color: white;
  }
</style>
<div id="wrapper">
  <main id="siff">
    <section>
      <div id="credentials">
        <div id="svg">${svg}</div>
        <p id="key">${key}</p>
      </div>
    </section>
  </main>
  <footer>
    <section>
      <small>This message was sent upon the request for a QR installation code. You need to install an authenticator to
        install the code. To install the QR code, use the authenticator app of your choice to scan the QR code.
        Alternatively, you can install it manually by entering the "Key" into the authenticator. The QR code is only
        valid temporarily and will expire if not used. For security concerns, never share your QR code with
        anyone.<br></small>
      <small class="author"><a href="https://www.colliverde.com/">Colliverde.</a></small>
    </section>
  </footer>
</div>`;

    const message = {
      to: email,
      from: 'yousif@almudhaf.com',
      subject: 'The Authenticator Code',
      content: [
        {
          type: 'text/html',
          value: emailTemplate
        }
      ],
      personalizations: [
        {
          to: [
            {
              email
            }
          ],
        }
      ],
    };

    const response = await mail.send(message);
    console.log(response);
    return response;
  }
  catch (error) {
    throw error;
  }
}