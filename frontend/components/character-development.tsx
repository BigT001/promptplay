"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, XIcon, LoaderIcon, RefreshIcon, TrashIcon, AlertCircleIcon } from "@/components/icons"
import { useCharacter } from "@/hooks/use-character"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { characterSchema, type CharacterFormData } from "@/lib/character-schema"

interface CharacterDevelopmentProps {
  projectId: number
}

export function CharacterDevelopment({ projectId }: CharacterDevelopmentProps) {
  const [activeTab, setActiveTab] = useState("list")
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null)
  const {
    characters,
    loading,
    fetchCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    generateCharacterBackground,
  } = useCharacter(projectId)

  const form = useForm<z.infer<typeof characterSchema>>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: "",
      role: "",
      description: "",
      personality: "",
      goals: "",
      background: "",
    },
  })

  useEffect(() => {
    fetchCharacters()
  }, [fetchCharacters])

  const onSubmit = async (data: z.infer<typeof characterSchema>) => {
    try {
      if (selectedCharacter) {
        await updateCharacter(selectedCharacter, data)
      } else {
        await createCharacter(data)
        form.reset()
      }
      setActiveTab("list")
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const handleEdit = (character: any) => {
    setSelectedCharacter(character.id)
    form.reset({
      name: character.name,
      role: character.role || "",
      description: character.description || "",
      personality: character.personality || "",
      goals: character.goals || "",
      background: character.background || "",
    })
    setActiveTab("edit")
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this character?")) {
      await deleteCharacter(id)
    }
  }

  const handleGenerateBackground = async (character: any) => {
    await generateCharacterBackground(character)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Character Development</CardTitle>
        <CardDescription>Create and manage your story's characters</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Characters</TabsTrigger>
            <TabsTrigger value="edit">{selectedCharacter ? "Edit" : "New"} Character</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="space-y-4">
              <Button onClick={() => { setSelectedCharacter(null); setActiveTab("edit") }}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Character
              </Button>

              {loading && (
                <div className="flex items-center justify-center p-4">
                  <LoaderIcon className="w-6 h-6 animate-spin" />
                </div>
              )}

              {!loading && characters.length === 0 && (
                <Alert>
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertDescription>
                    No characters created yet. Start by adding a new character.
                  </AlertDescription>
                </Alert>
              )}

              <ScrollArea className="h-[600px]">
                <Accordion type="single" collapsible>
                  {characters.map((character) => (
                    <AccordionItem key={character.id} value={character.id.toString()}>
                      <AccordionTrigger>{character.name}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {character.role && (
                            <div>
                              <h4 className="font-semibold">Role</h4>
                              <p className="text-sm text-muted-foreground">{character.role}</p>
                            </div>
                          )}
                          
                          {character.description && (
                            <div>
                              <h4 className="font-semibold">Description</h4>
                              <p className="text-sm text-muted-foreground">{character.description}</p>
                            </div>
                          )}

                          {character.personality && (
                            <div>
                              <h4 className="font-semibold">Personality</h4>
                              <p className="text-sm text-muted-foreground">{character.personality}</p>
                            </div>
                          )}

                          {character.goals && (
                            <div>
                              <h4 className="font-semibold">Goals</h4>
                              <p className="text-sm text-muted-foreground">{character.goals}</p>
                            </div>
                          )}

                          {character.background && (
                            <div>
                              <h4 className="font-semibold">Background</h4>
                              <p className="text-sm text-muted-foreground">{character.background}</p>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(character)}>
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateBackground(character)}
                            >
                              <RefreshIcon className="w-4 h-4 mr-2" />
                              Generate Background
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(character.id)}
                            >
                              <TrashIcon className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="edit">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>The character's role in the story</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>Physical and other notable characteristics</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personality</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>Character traits and behaviors</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goals</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>Character's motivations and objectives</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="background"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>Character's history and backstory</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-2">
                  <Button type="submit" disabled={loading}>
                    {loading && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
                    {selectedCharacter ? "Update" : "Create"} Character
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedCharacter(null)
                      form.reset()
                      setActiveTab("list")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}