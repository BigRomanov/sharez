# /lib/emailer.coffee

emailer = require("nodemailer")
fs      = require("fs")
_       = require("underscore")

class Emailer

  options: {}

  data: {}

  # Define attachments here
  attachments: [
    fileName: "logo.png"
    filePath: "./public/images/email/email_sharez_logo.png"
    cid: "logo@sharez"
  ]

  constructor: (@options, @data)->

  send: (callback)->
    html = @getHtml(@options.template, @data)
    attachments = @getAttachments(html)
    messageData =
      to: "'#{@options.to.name} #{@options.to.surname}' <#{@options.to.email}>"
      from: "'ShareZ'"
      subject: @options.subject
      html: html
      generateTextFromHTML: true
      attachments: attachments
    transport = @getTransport()
    transport.sendMail messageData, callback

  getTransport: ()->
    emailer.createTransport "SMTP",
      service: "Gmail"
      auth:
        user: "my email"
        pass: "somepassword"

  getHtml: (templateName, data)->
    templatePath = "./views/emails/#{templateName}.html"
    templateContent = fs.readFileSync(templatePath, encoding="utf8")
    _.template templateContent, data, {interpolate: /\{\{(.+?)\}\}/g}

  getAttachments: (html)->
    attachments = []
    for attachment in @attachments
      attachments.push(attachment) if html.search("cid:#{attachment.cid}") > -1
    attachments

exports = module.exports = Emailer