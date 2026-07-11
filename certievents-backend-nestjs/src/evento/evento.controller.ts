import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { EventoService } from './evento.service';

@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Get()
  async findAll() {
    return this.eventoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventoService.findOne(id);
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }
    // Retorna no formato mapeado que a página Evento.jsx do frontend espera
    return {
      nome: event.title,
      instituicao: event.instituicao || event.organizer,
      descricao: event.descricao || '',
      data: event.id === 'demo-week' ? '2026-07-15' : '2026-09-08', // compatível com split('-') no frontend
      horario: event.horario || '14:00',
    };
  }
}
