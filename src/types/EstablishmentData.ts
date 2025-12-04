export interface EstablishmentData {
    id: string,
    name: string,
    type: string,
    cnpj: string,
    adress: string,
    number: string,
    complement: string | null,
    neighborhood: string,
    city: string,
    cep: string,
    email: string,
    isActive: boolean,
    automations: Automations[]
}

export interface Automations {
    id: string,
    name: string,
    label: string,
    types?: string[]
    encrypted: Encrypted
    tasks: Tasks[]
}

export interface Encrypted {
    id: string,
    encryptedData: string
    iv: string
}

export interface Tasks {
    id: string,
    title: string,
    description: string,
    result: string,
    schedulings: TasksSchedulings
}

export interface TasksSchedulings {
    id: string,
    cron: string,
    isActive: boolean,
    rules: string[]
}