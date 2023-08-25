import React, { useState, useEffect } from 'react';
import Editor from './Editor'
import useLocalStorage from '../hooks/useLocalStorage'
import { framework } from '../util/framework-string';
import { initHTML, initJS, initCSS } from "../util/init-data"
import axios from 'axios';


const findOne = async (id) => {

  const config = {
    method: 'post',
    url: 'https://corsproxy.io/?' + encodeURIComponent('https://ap-south-1.aws.data.mongodb-api.com/app/data-xrfvv/endpoint/data/v1/action/findOne'),
    headers: {
      'Content-Type': 'application/json',
      'api-key': 'gEBIkXdXT2fO5WbWwSLiZx0riWuyL2VkEAz3Uq1TEyQPrRWTBnqWsDph3STgZXUj',
    },
    data: JSON.stringify({
      "collection": "codes",
      "database": "minframe",
      "dataSource": "minframe",
      "filter": {
        "_id": { "$oid": id },
      }
    })
  };

  try {
    const resp = await axios(config)
    return resp
  } catch (err) {
    console.error(err)
    return { "err": err }
  }

}

const updateOne = async (secretKey, { html, css, js }) => {
  const config = {
    method: 'post',
    url: 'https://corsproxy.io/?' + encodeURIComponent('https://ap-south-1.aws.data.mongodb-api.com/app/data-xrfvv/endpoint/data/v1/action/updateOne'),
    headers: {
      'Content-Type': 'application/json',
      'api-key': 'gEBIkXdXT2fO5WbWwSLiZx0riWuyL2VkEAz3Uq1TEyQPrRWTBnqWsDph3STgZXUj',
    },
    data: JSON.stringify({
      "collection": "codes",
      "database": "minframe",
      "dataSource": "minframe",
      "filter": {
        "_id": { "$oid": secretKey },
      },
      "update": {
        "$set": {
          "html": html,
          "css": css,
          "js": js
        }
      }
    })
  };

  try {
    const resp = await axios(config)
    return resp
  } catch (err) {
    console.error(err)
    return { "err": err }
  }
}

const createOne = async ({ html, css, js }) => {
  const config = {
    method: 'post',
    url: 'https://corsproxy.io/?' + encodeURIComponent('https://ap-south-1.aws.data.mongodb-api.com/app/data-xrfvv/endpoint/data/v1/action/insertOne'),
    headers: {
      'Content-Type': 'application/json',
      'api-key': 'gEBIkXdXT2fO5WbWwSLiZx0riWuyL2VkEAz3Uq1TEyQPrRWTBnqWsDph3STgZXUj',
    },
    data: JSON.stringify({
      "collection": "codes",
      "database": "minframe",
      "dataSource": "minframe",
      "document": {
        "html": html,
        "css": css,
        "js": js
      }
    })
  };

  try {
    const resp = await axios(config)
    return resp
  } catch (err) {
    console.error(err)
    return { "err": err }
  }

}






function App() {

  const [css, setCss] = useLocalStorage('css', initCSS)
  const [html, setHtml] = useLocalStorage('html', initHTML)
  const [js, setJs] = useLocalStorage('js', initJS)
  const [secretKey, setSecretKey] = useLocalStorage("secret-key", "")
  const [srcDoc, setSrcDoc] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
        <head>
        <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css'
    crossorigin="anonymous">
  
        </head>
          <body>${html}</body>
          <style>${css}</style>
          <script> ${framework}  </script>
          <script defer>${js}</script >
        </html >
      `)
    }, 250)

    // console.log(findOne("64e8b1c6a4cdc65a39a0d15a"))

    return () => clearTimeout(timeout)
  }, [html, css, js])

  const downloadCode = async () => {

    if (secretKey) {
      try {
        const resp = await findOne(secretKey)
        if (resp.data) {

          const { html, js, css } = resp.data.document
          setCss(css)
          setHtml(html)
          setJs(js)
          alert("data has been downloaded")
        }
        if (resp.err) {
          alert("secret key is invalid")
          setSecretKey("")
        }
      } catch (err) {
        console.error(err)
      }

    }
  }

  const uploadCode = async () => {
    if (secretKey) {
      const resp = await updateOne(secretKey, { html, css, js })
      if (resp.data) {

        alert("data has been saved")
      }

      if (resp.err) {
        alert("secret key is invalid")
        setSecretKey("")

      }
    } else {
      const resp = await createOne({ html, css, js })
      if (resp.data) {

        const { insertedId } = resp.data
        setSecretKey(insertedId)
      }
      if (resp.err) {
        alert(resp.err)
      }
    }
  }


  return (
    <>
      <nav className="navbar bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Minframe</a>
          <form className="d-flex" role="search">

            <button className="btn btn-outline-success  mx-2 text-light" onClick={uploadCode} type="button">upload</button>
            <input className="form-control me-2 text-light" value={secretKey} onChange={e => setSecretKey(e.target.value)} type="search" placeholder="secret key" aria-label="search"></input>
            <button className="btn btn-outline-success text-light" onClick={downloadCode} type="button">download</button>
          </form>
        </div>
      </nav>
      <div className="pane top-pane">

        <Editor
          language="css"
          displayName="CSS"
          value={css}
          onChange={setCss}
        />
        <Editor
          language="xml"
          displayName="HTML"
          value={html}
          onChange={setHtml}
        />
        <Editor
          language="javascript"
          displayName="JS"
          value={js}
          onChange={setJs}
        />
      </div>
      <div className="pane">
        <iframe
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
    </>
  )
}

export default App;
