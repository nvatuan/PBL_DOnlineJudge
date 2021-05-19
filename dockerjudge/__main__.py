"WebSocket server"

import asyncio
from asyncio import get_event_loop, new_event_loop, set_event_loop
from concurrent.futures import ThreadPoolExecutor
from functools import partial
from json import JSONEncoder as _JSONEncoder
from json import dumps, loads
from sys import argv

import websockets

from .main import judge
from .status import Status

import logging
logging.basicConfig(level=logging.INFO)  

executor = ThreadPoolExecutor()  # pylint: disable = E0012, consider-using-with

class JSONEncoder(_JSONEncoder):
    "TypeError: Object is not JSON serializable"

    def default(self, o):
        "bytes and dockerjudge.status.Status"
        if isinstance(o, bytes):
            return o.decode()
        if isinstance(o, Status):
            return o.name
        return _JSONEncoder.default(self, o)

stop_sending_heartbeat = False ## lock the heartbeat service

async def server(websocket, path):  # pylint: disable = W0613
    global stop_sending_heartbeat
    "WebSocket server"
    loop = get_event_loop()

    kwargs = loads(await websocket.recv())

    logging.info("Received a connection " + repr(websocket.remote_address))
    logging.info("Kwargs: " + repr(kwargs))

    await websocket.send(dumps(["judge", kwargs]))
    kwargs["source"] = kwargs["source"].encode()
    kwargs["tests"] = [(i.encode(), o.encode()) for i, o in kwargs["tests"]]
    kwargs["config"]["callback"] = {
        "compile": lambda *args: loop.create_task(
            websocket.send(dumps(["compile", args], cls=JSONEncoder))
        )
    }
    res = await loop.run_in_executor(executor, partial(judge, **kwargs))
    await websocket.send(dumps(["done", res], cls=JSONEncoder))
    logging.info("Closing connection on " + repr(websocket.remote_address))

from time import sleep
import requests
class HeartbeatSender():
    def __init__(self, url, token) -> None:
        self.url = url
        self.token = token

        self.headers = {'Content-Type':'application/json','Connection':'close'}
        self.data = {'token':self.token}

    def heartbeat_sender(self, period=5) -> None:
        global stop_sending_heartbeat

        retry = 0
        while True:
            try:
                while True:
                    if not stop_sending_heartbeat:
                        r = requests.post(self.url, headers=self.headers, data=dumps(self.data))
                        logging.info(f"Heartbeat sent, response = {r}")
                    sleep(period)
                    retry=0
            except ConnectionError: 
                logging.error("Cannot connect to the given URL. Aborting..")
                break
            except KeyboardInterrupt: 
                logging.info("Interrupted by user")
                break
            except Exception as e:
                retry += 1
                if retry > 3:
                    logging.error("Failed after 3 retries. Aborting..")
                    break
                logging.error("Something went wrong at 'heartbeat_sender':", e)
                logging.error(f"Retrying (attempt {retry})..")
    
from threading import Thread
URL = "http://127.0.0.1:9999/judgeserver_heartbeat/" ## CHANGE ME
TOK = "ADTLVBoEHRTz1C0HrObs6nwTiz8mzfGv" ## CHANGE ME

def main(*args):
    logging.info("Creating heartbeat thread..")
    heartbeat_thread = Thread(target=HeartbeatSender(URL, TOK).heartbeat_sender)
    heartbeat_thread.start()
    logging.info("Heartbeat thread started..")

    "if __name__ == '__main__'"
    set_event_loop(new_event_loop())
    start_server = websockets.serve(server, *args)

    logging.info("Websocket server is starting..")
    get_event_loop().run_until_complete(start_server)
    get_event_loop().run_forever()


if __name__ == "__main__":
    try:
        main(*argv[1].split(":"))
    except KeyboardInterrupt:
        print()
