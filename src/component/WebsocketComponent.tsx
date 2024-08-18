import {
  Client,
  CompatClient,
  Message,
  Stomp,
  StompSubscription,
} from "@stomp/stompjs";
import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";

interface Metrics {
  time: string;
  cpuUsage: string;
  totalMemorySize: string;
  freeMemorySize: string;
  memoryUsage: string;
}

const WebsocketComponent = () => {
  const [stompClient, setStompClient] = useState<CompatClient>();
  const [metrics, setMetrics] = useState<Metrics>();
  let subscription: StompSubscription | undefined = undefined;

  useEffect(() => {
    // Initialize SockJS and STOMP client
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe("/topic/metrics", (message) => {
        setMetrics(JSON.parse(message.body));
      });
    });

    setStompClient(client);

    return () => {
      client.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      stompClient.send("/app/message", {}, "hello");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">System Metrics</h1>
      <div className="">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPU Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Free Memory Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Memory Usage
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {metrics?.time}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {metrics?.cpuUsage}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {metrics?.freeMemorySize}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {metrics?.memoryUsage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WebsocketComponent;
