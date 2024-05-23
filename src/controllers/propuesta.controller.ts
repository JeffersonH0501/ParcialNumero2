import { Controller, Get } from '@nestjs/common';
import { PropuestaService } from 'src/services/propuesta.service';
import { Propuesta } from 'src/models/propuesta.entity';

@Controller('propuestas')
export class PropuestaController {
    constructor(private readonly propuestaService: PropuestaService) {}

    @Get()
    async findAllPropuestas(): Promise<Propuesta[]> {
        return this.propuestaService.findAllPropuestas();
    }
}