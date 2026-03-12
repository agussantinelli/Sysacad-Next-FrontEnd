import { TestBed } from '@angular/core/testing';
import { StudentService } from './student.service';
import axiosClient from '@core/api/axios.client';

describe('StudentService', () => {
    let service: StudentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StudentService]
        });

        spyOn(axiosClient, 'get');

        service = TestBed.inject(StudentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should getRegularCertificate', (done) => {
        const mockBlob = new Blob(['test']);
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockBlob }));

        service.getRegularCertificate().subscribe(data => {
            expect(data).toEqual(mockBlob);
            expect(axiosClient.get).toHaveBeenCalledWith('/alumnos/certificado-regular', jasmine.objectContaining({ responseType: 'blob' }));
            done();
        });
    });
});
