'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  const [notionConnected, setNotionConnected] = useState(false)
  const [airtableConnected, setAirtableConnected] = useState(false)

  const handleConnectNotion = () => {
    window.location.href = '/api/auth/notion'
  }

  const handleConnectAirtable = () => {
    window.location.href = '/api/auth/airtable'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Conecta tus herramientas para empezar a sincronizar</p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Notion Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Notion
                </CardTitle>
                <Badge variant={notionConnected ? 'default' : 'secondary'}>
                  {notionConnected ? 'Conectado' : 'Desconectado'}
                </Badge>
              </div>
              <CardDescription>
                Sincroniza tus bases de datos de Notion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleConnectNotion}
                disabled={notionConnected}
                className="w-full"
                variant={notionConnected ? 'outline' : 'default'}
              >
                {notionConnected ? 'Conectado' : 'Conectar Notion'}
              </Button>
            </CardContent>
          </Card>

          {/* Airtable Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Airtable
                </CardTitle>
                <Badge variant={airtableConnected ? 'default' : 'secondary'}>
                  {airtableConnected ? 'Conectado' : 'Desconectado'}
                </Badge>
              </div>
              <CardDescription>
                Sincroniza tus bases de Airtable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleConnectAirtable}
                disabled={airtableConnected}
                className="w-full"
                variant={airtableConnected ? 'outline' : 'default'}
              >
                {airtableConnected ? 'Conectado' : 'Conectar Airtable'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sync Section */}
        {notionConnected && airtableConnected && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                ¡Listo para sincronizar!
              </CardTitle>
              <CardDescription>
                Ambas herramientas están conectadas. Puedes empezar a sincronizar datos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Crear primera sincronización
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
