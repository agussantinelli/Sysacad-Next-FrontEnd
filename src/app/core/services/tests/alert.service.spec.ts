import { TestBed } from '@angular/core/testing';
import { AlertService } from '../alert.service';

describe('AlertService', () => {
    let service: AlertService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [AlertService] });
        service = TestBed.inject(AlertService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show success alert', (done) => {
        service.alert$.subscribe(alert => {
            if (alert) {
                expect(alert.type).toBe('success');
                expect(alert.message).toBe('Test Success');
                done();
            }
        });
        service.success('Test Success');
    });

    it('should show error alert', (done) => {
        service.alert$.subscribe(alert => {
            if (alert) {
                expect(alert.type).toBe('error');
                expect(alert.message).toBe('Test Error');
                done();
            }
        });
        service.error('Test Error');
    });

    it('should clear alert', (done) => {
        service.success('Wait');
        service.clear();
        service.alert$.subscribe(alert => {
            expect(alert).toBeNull();
            done();
        });
    });
});

