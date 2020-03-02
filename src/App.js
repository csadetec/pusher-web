import React, { useState, useEffect } from 'react';
import api from './service/api'
import Pusher from 'pusher-js'

function App() {
  const [msg, setMsg] = useState('')
  const [allMsg, setAllMsg] = useState([])

  useEffect(() => {
    async function load() {
      Pusher.logToConsole = true;
      const pusher = new Pusher('93551fcbc823c6f1fe0a', {
        cluster: 'us2',
        forceTLS: true
      });

      const channel = await pusher.subscribe('my-channel');
      channel.bind('my-event', data => {
        let addMsg = allMsg
        addMsg.push(data)
        
        setAllMsg(addMsg)
        console.log(allMsg)

      });
    }
    load()

  }, [allMsg])



  async function handleSubit(e) {
    e.preventDefault()

    if (msg === '') {
      return
    }

    const { data } = await api.post('/', { msg })
    let addMsg = allMsg
    addMsg.push(data)

    setAllMsg(addMsg)
    //console.log(allMsg)
    setMsg('')

  }


  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-6">
          <form className="form-inline" onSubmit={handleSubit} >
            <div className="form-group">
              <input type="text" className="form-control-lg" placeholder="Digita sua mensagem..." value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Enviar</button>
          </form>
        </div>
        <div className="col-md-6">
          <ul className="list-group">
            {allMsg.map(r =>
              <li key={r.id} className="list-group-item">{r.msg}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
