"use client"
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Save, Settings2 } from 'lucide-react'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { Project } from './project-editor'

const Settings = ({ project, setProject }: {
    project: Project,
    setProject: any
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-card'>
                <DialogHeader>
                    <DialogTitle className="text-lg">Project Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Project Name</label>
                        <Input value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            value={project.description || ""}
                            onChange={(e) => setProject({ ...project, description: e.target.value })}
                            placeholder="Project description..."
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Live Url</label>
                        <Input value={project.liveUrl || ""} onChange={(e) => setProject({ ...project, liveUrl: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Creator Social</label>
                        <Input value={project.creator || ""} onChange={(e) => setProject({ ...project, creator: e.target.value })} />
                    </div>
                    <Button
                        size="sm"
                        onClick={() => {
                            // Save project settings
                            fetch(`/api/projects/${project.slug}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(project),
                            })
                            toast.success("Settings saved")
                        }}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Settings