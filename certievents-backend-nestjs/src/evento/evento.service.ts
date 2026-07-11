import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evento, EventoDocument } from '../database/schemas/evento.schema';

@Injectable()
export class EventoService implements OnModuleInit {
  constructor(
    @InjectModel(Evento.name) private readonly eventoModel: Model<EventoDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.eventoModel.countDocuments();
    if (count === 0) {
      console.log('Seeding mock events into MongoDB...');
      await this.eventoModel.create([
        {
          id: 'demo-week',
          title: 'Demo Week - Evento de Tecnologia e Inovação',
          organizer: 'IFPE Campus Igarassu',
          date: '15 e 16 de Julho',
          location: 'Campus Igarassu - PE',
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
          isOfficial: true,
          price: 'Grátis',
          descricao: 'O futuro não está chegando, ele já está AQUI. Prepare-se para uma imersão total no ecossistema que está moldando o amanhã. Vem aí a DEMO WEEK no IFPE Campus Igarassu! Nos dias 15 e 16 de julho, vamos hackear o presente e desbloquear o próximo nível da tecnologia e da inovação. Esqueça o básico: prepare-se para códigos, inteligência artificial, robótica e insights que vão explodir a sua mente! 🧠💥 Tech, ideias e muita inovação!',
          instituicao: 'IFPE - Campus Igarassu',
          horario: '14:00',
        },
        {
          id: 'react-19',
          title: 'React 19 & Vite Bootcamp',
          organizer: 'DevCommunity Nordeste',
          date: '20 de Julho às 19:00',
          location: 'Recife, PE',
          imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
          isOfficial: false,
          price: 'R$ 29,90',
          descricao: 'Imersão prática nas novidades do React 19 e Vite, com foco em Server Components, Actions e otimizações de build.',
          instituicao: 'DevCommunity Nordeste',
          horario: '19:00',
        },
        {
          id: 'laravel-aws',
          title: 'Workshop Laravel & AWS Cloud',
          organizer: 'TSI Alumni',
          date: '28 de Out a 02 de Nov',
          location: 'Online',
          imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
          isOfficial: false,
          price: 'Grátis',
          descricao: 'Aprenda a fazer o deploy e escalar aplicações Laravel na nuvem da AWS utilizando serviços como RDS, S3, EC2 e SES.',
          instituicao: 'TSI Alumni',
          horario: '19:00',
        },
        {
          id: 'metal-fest',
          title: 'Metal Fest Recife 2026',
          organizer: 'Darkside Studio',
          date: 'Sábado, 15 de Ago às 19:00',
          location: 'Recife, PE',
          imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
          isOfficial: false,
          price: 'R$ 45,00',
          descricao: 'O maior festival de metal autoral de Recife, reunindo bandas locais e convidados especiais para uma noite eletrizante.',
          instituicao: 'Darkside Studio',
          horario: '19:00',
        },
      ]);
      console.log('Seeding completed successfully.');
    }
  }

  async findAll(): Promise<Evento[]> {
    return this.eventoModel.find().exec();
  }

  async findOne(id: string): Promise<Evento | null> {
    return this.eventoModel.findOne({ id }).exec();
  }
}
