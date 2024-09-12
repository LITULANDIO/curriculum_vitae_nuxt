import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const response = await resend.emails.send({
      from: 'contacto@carlesfar.com',
      to: body.email,
      subject: body.subject,
      html: `<p>${body.message}</p>`,
    })

    return { status: 'success', data: response }
  } catch (error) {
    return { status: 'error', message: error.message }
  }
})
