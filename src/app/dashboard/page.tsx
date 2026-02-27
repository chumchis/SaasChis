'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface NotionDatabase {
  id: string
  title: string
}

interface AirtableBase {
  id: string
  name: string
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const [notionConnected, setNotionConnected] = useState(false)
  const [airtableConnected, setAirtableConnected] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Sync modal state
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const [notionDatabases, setNotionDatabases] = useState<NotionDatabase[]>([])
  const [airtableBases, setAirtableBases] = useState<AirtableBase[]>([])
  const [selectedNotionDb, setSelectedNotionDb] = useState('')
  const [selectedAirtableBase, setSelectedAirtableBase] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    setMounted(true)
    
    const savedNotion = localStorage.getItem('notion_connected') === 'true'
    const savedAirtable = localStorage.getItem('airtable_connected') === 'true'
    
    setNotionConnected(savedNotion)
    setAirtableConnected(savedAirtable)
    
    const notionParam = searchParams.get('notion')
    const airtableParam = searchParams.get('airtable')
    
    if (notionParam === 'connected') {
      setNotionConnected(true)
      localStorage.setItem('notion_connected', 'true')
    }
    
    if (airtableParam === 'connected') {
      setAirtableConnected(true)
      localStorage.setItem('airtable_connected', 'true')
    }
  }, [searchParams])

  const handleConnectNotion = () => {
    window.location.href = '/api/auth/notion'
  }

  const handleConnectAirtable = () => {
    window.location.href = '/api/auth/airtable'
  }

  const handleDisconnectNotion = async () => {
    await fetch('/api/auth/notion/disconnect', { method: 'POST' })
    localStorage.removeItem('notion_connected')
    setNotionConnected(false)
  }

  const handleDisconnectAirtable = async () => {
    await fetch('/api/auth/airtable/disconnect', { method: 'POST' })
    localStorage.removeItem('airtable_connected')
    setAirtableConnected(false)
  }

  const handleOpenSyncModal = async () => {
    setIsSyncModalOpen(true)
    setIsFetching(true)
    setSyncStatus('idle')
    
    try {
      // Fetch Notion databases
      const notionRes = await fetch('/api/notion/databases')
      if (notionRes.ok) {
        const notionData = await notionRes.json()
        setNotionDatabases(notionData.databases || [])
      }
      
      // Fetch Airtable bases
      const airtableRes = await fetch('/api/airtable/bases')
      if (airtableRes.ok) {
        const airtableData = await airtableRes.json()
        setAirtableBases(airtableData.bases || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleCreateSync = async () => {
    if (!selectedNotionDb || !selectedAirtableBase) return
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notionDatabaseId: selectedNotionDb,
          airtableBaseId: selectedAirtableBase,
        }),
      })
      
      if (res.ok) {
        setSyncStatus('success')
        setTimeout(() => {
          setIsSyncModalOpen(false)
          setSyncStatus('idle')
          setSelectedNotionDb('')
          setSelectedAirtableBase('')
        }, 2000)
      } else {
        setSyncStatus('error')
      }
    } catch (error) {
      console.error('Error creating sync:', error)
      setSyncStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
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
              {notionConnected ? (
                <Button 
                  onClick={handleDisconnectNotion}
                  className="w-full"
                  variant="outline"
                >
                  Desconectar Notion
                </Button>
              ) : (
                <Button 
                  onClick={handleConnectNotion}
                  className="w-full"
                >
                  Conectar Notion
                </Button>
              )}
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
              {airtableConnected ? (
                <Button 
                  onClick={handleDisconnectAirtable}
                  className="w-full"
                  variant="outline"
                >
                  Desconectar Airtable
                </Button>
              ) : (
                <Button 
                  onClick={handleConnectAirtable}
                  className="w-full"
                >
                  Conectar Airtable
                </Button>
              )}
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
              <Dialog open={isSyncModalOpen} onOpenChange={setIsSyncModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg" onClick={handleOpenSyncModal}>
                    Crear primera sincronización
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Crear sincronización</DialogTitle>
                    <DialogDescription>
                      Selecciona una base de datos de Notion y una base de Airtable para sincronizar.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-6 py-4">
                    {isFetching ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-500">Cargando bases...</span>
                      </div>
                    ) : (
                      <>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Base de datos de Notion</label>
                          <Select value={selectedNotionDb} onValueChange={setSelectedNotionDb}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una base de Notion" />
                            </SelectTrigger>
                            <SelectContent>
                              {notionDatabases.length === 0 ? (
                                <SelectItem value="none" disabled>
                                  No se encontraron bases
                                </SelectItem>
                              ) : (
                                notionDatabases.map((db) => (
                                  <SelectItem key={db.id} value={db.id}>
                                    {db.title}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Base de Airtable</label>
                          <Select value={selectedAirtableBase} onValueChange={setSelectedAirtableBase}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una base de Airtable" />
                            </SelectTrigger>
                            <SelectContent>
                              {airtableBases.length === 0 ? (
                                <SelectItem value="none" disabled>
                                  No se encontraron bases
                                </SelectItem>
                              ) : (
                                airtableBases.map((base) => (
                                  <SelectItem key={base.id} value={base.id}>
                                    {base.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {syncStatus === 'success' && (
                      <div className="rounded-md bg-green-100 p-3 text-sm text-green-800">
                        ✅ Sincronización creada exitosamente
                      </div>
                    )}
                    
                    {syncStatus === 'error' && (
                      <div className="rounded-md bg-red-100 p-3 text-sm text-red-800">
                        ❌ Error al crear la sincronización. Intenta de nuevo.
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSyncModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleCreateSync}
                      disabled={!selectedNotionDb || !selectedAirtableBase || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        'Crear sincronización'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Cargando...</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardContent />
    </Suspense>
  )
}